// Creates a Ziina payment for "Your Design, Written" (AED 177) and returns the hosted payment page.
// Needs the environment variable ZIINA_API_KEY (set by Cici in Netlify). ZIINA_TEST=true makes test payments.
const crypto = require('crypto');
const PRICE_FILS = 11100; // AED 111.00 (launch price)
const SITE = process.env.SITE_URL || 'https://humanbydesign.global';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'Bad request' }; }
  const r = String(body.r || '');
  if (!/^[A-Za-z0-9_-]{20,3000}$/.test(r)) return { statusCode: 400, body: 'Bad request' };
  const lang = body.lang === 'ar' ? 'ar' : 'en';
  const ref = crypto.createHash('sha256').update(r).digest('hex').slice(0, 12);
  const back = SITE + '/report.html?lang=' + lang + '&r=' + r;
  const res = await fetch('https://api-v2.ziina.com/api/payment_intent', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: PRICE_FILS, currency_code: 'AED',
      message: 'Your Design, Written · ref ' + ref,
      success_url: back + '&pi={PAYMENT_INTENT_ID}',
      cancel_url: back, failure_url: back,
      test: process.env.ZIINA_TEST === 'true'
    })
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.redirect_url) return { statusCode: 502, body: JSON.stringify({ error: 'payment_unavailable' }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ redirect_url: j.redirect_url }) };
};
