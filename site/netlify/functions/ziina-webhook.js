// Ziina calls this when a payment changes status. For completed report payments it emails the buyer their report,
// so delivery happens even if they closed the page before returning to the site.
// The payload is never trusted: the payment is re-read from Ziina's API with our key.
const { sendReportEmail, fromIntent } = require('../lib/mail');
const SITE = process.env.SITE_URL || 'https://humanbydesign.global';
// AED 55.00 now; AED 111.00 kept so earlier buyers' report links keep opening.
const PRICES_FILS = [5500, 11100];
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
  let id = '';
  try { const b = JSON.parse(event.body || '{}'); id = String((b.data && b.data.id) || ''); } catch (e) {}
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(id) || !process.env.ZIINA_API_KEY) return { statusCode: 200, body: 'ignored' };
  const res = await fetch('https://api-v2.ziina.com/api/payment_intent/' + encodeURIComponent(id), { headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY } });
  if (!res.ok) return { statusCode: 502, body: 'retry' };
  const j = await res.json().catch(() => ({}));
  const isReport = typeof j.message === 'string' && j.message.indexOf('· ref ') > 0 && PRICES_FILS.includes(Number(j.amount)) && j.currency_code === 'AED';
  if (j.status !== 'completed' || !isReport) return { statusCode: 200, body: 'ok' };
  const m = fromIntent(j, SITE);
  if (!m) return { statusCode: 200, body: 'ok' };
  const out = await sendReportEmail(Object.assign({ pi: id }, m));
  return { statusCode: out.sent || out.reason ? 200 : 502, body: out.sent ? 'sent' : 'not sent' };
};
