// Starts a Ziina payment for a reading and returns Ziina's payment page.
// Needs ZIINA_API_KEY in Netlify (Project configuration > Environment variables). ZIINA_TEST=true makes test payments.
const READERS = { cici: 'Cici', rayjai: 'Rayjai' };
const PRICE_FILS = 77700; // AED 777.00
const SITE = process.env.SITE_URL || 'https://humanbydesign.global';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  if (!process.env.ZIINA_API_KEY) return { statusCode: 503, body: JSON.stringify({ error: 'not_configured' }) };
  let b; try { b = JSON.parse(event.body || '{}'); } catch (e) { return { statusCode: 400, body: 'Bad request' }; }
  const reader = String(b.reader || ''); const email = String(b.email || '').trim().slice(0, 120);
  if (!READERS[reader] || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return { statusCode: 400, body: JSON.stringify({ error: 'bad_input' }) };
  const lang = b.lang === 'ar' ? 'ar' : 'en';
  const back = SITE + '/booked.html?lang=' + lang + '&reader=' + reader;
  const res = await fetch('https://api-v2.ziina.com/api/payment_intent', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: PRICE_FILS, currency_code: 'AED',
      message: 'Reading with ' + READERS[reader] + ' · ' + email,
      success_url: back + '&pi={PAYMENT_INTENT_ID}',
      cancel_url: SITE + '/readers.html?lang=' + lang, failure_url: SITE + '/readers.html?lang=' + lang,
      test: process.env.ZIINA_TEST === 'true'
    })
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.redirect_url) return { statusCode: 502, body: JSON.stringify({ error: 'payment_unavailable' }) };
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ redirect_url: j.redirect_url }) };
};
