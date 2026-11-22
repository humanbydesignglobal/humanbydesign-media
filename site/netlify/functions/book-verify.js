// Confirms a reading was paid on Ziina, then hands back that reader's private booking calendar.
const READERS = {
  cici:   { name: 'Cici',   cal: process.env.CAL_CICI   || 'https://calendly.com/cynthia-khourym/your-chart-explained' },
  rayjai: { name: 'Ram', cal: process.env.CAL_RAYJAI || '' }
};
const PRICE_FILS = 77700;
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const pi = String(q.pi || ''), r = READERS[String(q.reader || '')];
  const out = (o) => ({ statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(o) });
  if (!r || !/^[A-Za-z0-9_-]{6,100}$/.test(pi) || !process.env.ZIINA_API_KEY) return out({ paid: false });
  const res = await fetch('https://api-v2.ziina.com/api/payment_intent/' + encodeURIComponent(pi), {
    headers: { 'Authorization': 'Bearer ' + process.env.ZIINA_API_KEY }
  });
  if (!res.ok) return out({ paid: false });
  const j = await res.json().catch(() => ({}));
  const paid = j.status === 'completed' && Number(j.amount) === PRICE_FILS && j.currency_code === 'AED'
    && typeof j.message === 'string' && j.message.indexOf('Reading with ' + r.name + ' ·') === 0;
  return out(paid ? { paid: true, cal: r.cal } : { paid: false, status: j.status || '' });
};
