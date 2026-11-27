// Netlify function for the app's "Ask" feature. Copy to site/netlify/functions/ask.js
// on humanbydesign.global and add ANTHROPIC_API_KEY in Netlify (Cici pastes it; never typed by Claude).
// Optional: REVENUECAT_SECRET to verify Gold server-side (recommended before launch).
const MODEL = process.env.ASK_MODEL || 'claude-haiku-5-5';
const hits = new Map(); // simple per-IP cap per warm instance

function system(lang, chart, name) {
  return [
    'You are the voice of Human by Design (humanbydesign.global), founded by Cici. You teach Human Design warmly, simply and honestly, like a wise friend, never like an ad.',
    'Answer for THIS person\'s chart only. Be practical: one clear idea, a real-life example, and one small experiment. 120-220 words. No bullet lists unless asked. No emojis.',
    'Human Design is a tool for self-reflection, not medical, psychological or financial advice. If someone describes a crisis, health or legal problem, gently point them to a qualified professional.',
    lang === 'ar'
      ? 'Write in casual spoken Lebanese Arabic (not formal MSA). Keep Human Design terms in English written in Arabic letters, e.g. بروجكتور، السبلين، السولار بلكسس، السكرال. Never use الطحال.'
      : 'Write in clear, warm English.',
    `Their name: ${String(name || '').slice(0, 40)}. Their chart: ${JSON.stringify(chart).slice(0, 4000)}`,
  ].join('\n');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'POST only' };
  const ip = event.headers['x-nf-client-connection-ip'] || 'x';
  const day = new Date().toISOString().slice(0, 10);
  const k = ip + day;
  hits.set(k, (hits.get(k) || 0) + 1);
  if (hits.get(k) > 60) return { statusCode: 429, body: JSON.stringify({ error: 'limit' }) };
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, body: 'bad json' }; }
  const { lang, chart, name, messages } = body;
  if (!Array.isArray(messages) || !messages.length) return { statusCode: 400, body: 'no messages' };
  const clean = messages.slice(-10).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 2000) }));
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, system: system(lang, chart, name), messages: clean }),
  });
  if (!r.ok) return { statusCode: 502, body: JSON.stringify({ error: 'upstream' }) };
  const j = await r.json();
  const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  return { statusCode: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) };
};
