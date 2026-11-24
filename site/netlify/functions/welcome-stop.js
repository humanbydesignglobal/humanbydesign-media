// Unsubscribe link in the welcome emails: cancels the emails still waiting (their ids are in the signed link).
const { sign } = require('../lib/welcome');
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const ids = String(q.i || ''), ar = q.lang === 'ar';
  let ok = sign(ids) === String(q.s || '');
  if (ok && ids) {
    for (const id of ids.split('.').filter(x => /^[0-9a-f-]{36}$/.test(x))) {
      await fetch('https://api.resend.com/emails/' + id + '/cancel', { method: 'POST', headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY } }).catch(() => {});
    }
  }
  const msg = ok ? (ar ? 'تمّ. ما رح يوصلك ولا إيميل ترحيب بعد هلّق.' : "Done. You won't get any more welcome emails.") : (ar ? 'الرابط مش صالح.' : 'This link is not valid.');
  const sub = ar ? 'إذا بدك توقّف المكتوب الأسبوعي كمان، استعمل رابط إلغاء الاشتراك تحت أي مكتوب.' : 'To stop the weekly letter too, use the unsubscribe link at the bottom of any letter.';
  if (event.httpMethod === 'POST') return { statusCode: 200, body: ok ? 'ok' : 'invalid' };
  return { statusCode: ok ? 200 : 400, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: `<!doctype html><html dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Human by Design</title></head><body style="margin:0;background:#FBF7F1;font:300 17px/1.7 Inter,Helvetica,Arial,sans-serif;color:#2e2620"><div style="max-width:520px;margin:18vh auto;padding:0 24px;text-align:center"><p style="font:500 11px Inter,Arial;letter-spacing:.18em;text-transform:uppercase;color:#8a7f76">Human by Design</p><p>${msg}</p><p style="font-size:14px;color:#6F645C">${ok ? sub : ''}</p><p><a href="https://humanbydesign.global" style="color:#B8231B">humanbydesign.global</a></p></div></body></html>` };
};
