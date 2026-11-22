// One-off: registers ziina-webhook with Ziina (calling it again just re-registers the same URL).
const SITE = process.env.SITE_URL || 'https://humanbydesign.global';
exports.handler = async () => {
  if (!process.env.ZIINA_API_KEY) return { statusCode: 503, body: 'no key' };
  const res = await fetch('https://api-v2.ziina.com/api/webhook', {
    method: 'POST', headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: SITE + '/.netlify/functions/ziina-webhook' })
  });
  const t = await res.text();
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: res.ok, status: res.status, body: t.slice(0, 300) }) };
};
