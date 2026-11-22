// Sends a sample "report ready" email to Cici only (fixed recipient), so she can see what buyers get.
const { sendReportEmail } = require('../lib/mail');
exports.handler = async (event) => {
  const lang = (event.queryStringParameters || {}).lang === 'ar' ? 'ar' : 'en';
  const out = await sendReportEmail({ to: 'cici@humanbydesign.global', name: lang === 'ar' ? 'سيسي' : 'Cici', lang,
    url: 'https://humanbydesign.global/report.html?lang=' + lang, pi: 'sample-' + lang + '-' + Date.now() });
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out) };
};
