// Called by guide.html when someone gets their free chart: schedules the five welcome emails (netlify/lib/welcome.js).
const { scheduleWelcome, fromRequest } = require('../lib/welcome');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
  if (!process.env.RESEND_API_KEY) return { statusCode: 200, body: JSON.stringify({ ok: false, reason: 'not_configured' }) };
  let b = {};
  try { b = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: '' }; }
  const v = fromRequest(b);
  if (!v) return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  const out = await scheduleWelcome(v);
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: out.every(x => x.ok), steps: out.map(x => ({ n: x.n, ok: x.ok })) }) };
};
