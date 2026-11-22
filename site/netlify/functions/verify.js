// Confirms a Ziina payment is completed, for the right amount, and for this exact chart (the ref in the message).
const crypto = require('crypto');
const PRICE_FILS = 11100;

exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const pi = String(q.pi || ''), r = String(q.r || '');
  const no = { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paid: false }) };
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(pi) || !/^[A-Za-z0-9_-]{20,3000}$/.test(r)) return no;
  const res = await fetch('https://api-v2.ziina.com/api/payment_intent/' + encodeURIComponent(pi), {
    headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY }
  });
  if (!res.ok) return no;
  const j = await res.json().catch(() => ({}));
  const ref = crypto.createHash('sha256').update(r).digest('hex').slice(0, 12);
  const paid = j.status === 'completed' && Number(j.amount) === PRICE_FILS && j.currency_code === 'AED'
    && typeof j.message === 'string' && j.message.indexOf('ref ' + ref) >= 0;
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify({ paid }) };
};
