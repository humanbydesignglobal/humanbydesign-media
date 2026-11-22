// Sends the "your report is ready" email through Resend. Needs RESEND_API_KEY (pasted by Cici in Netlify).
// Sender domain humanbydesign.global must be verified in Resend. Idempotent per payment: one email per payment intent.
const FROM = process.env.MAIL_FROM || 'Cici · Human by Design <cici@humanbydesign.global>';
const REPLY = process.env.MAIL_REPLY_TO || 'cici@humanbydesign.global';
function esc(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

function html(lang, name, url) {
  const ar = lang === 'ar';
  const t = ar ? {
    pre: 'تقريرك جاهز', h: 'تصميمك،<br><i>بالتفصيل.</i>', hi: 'أهلا ' + esc(name) + '،',
    p1: 'تقريرك جاهز. هيدي خريطتك كلها، مقروءة إلك للآخر.',
    p2: 'افتحو عمهلك، وارجعلو كل ما احتجت. إذا بدك نسخة تحتفظ فيها، اضغط "احفظ كـPDF" بآخر التقرير.',
    btn: 'افتح تقريري', keep: 'خلّي هالإيميل: الرابط إلك عطول، وبيفتح تقريرك من أي جهاز.',
    love: 'بكل حب، سيسي', disc: 'الهيومان ديزاين أداة للتأمّل بالذات، مش نصيحة طبية ولا نفسية ولا مالية.'
  } : {
    pre: 'Your report is ready', h: 'your design,<br><i>decoded.</i>', hi: 'Hi ' + esc(name) + ',',
    p1: 'Your report is ready. This is your whole chart, read for you, all the way down.',
    p2: 'Read it slowly and come back to it whenever you need. To keep a copy, tap "Save as PDF" at the end of the report.',
    btn: 'Open my report', keep: 'Keep this email: the link is yours forever and opens your report on any device.',
    love: 'With love, Cici', disc: 'Human Design is a tool for self-reflection. It is not medical, psychological or financial advice.'
  };
  const dir = ar ? 'rtl' : 'ltr', align = ar ? 'right' : 'left';
  const serif = ar ? "'Amiri',Georgia,serif" : "'Instrument Serif',Georgia,serif";
  const sans = ar ? "'IBM Plex Sans Arabic',Arial,sans-serif" : "Inter,Helvetica,Arial,sans-serif";
  const hand = ar ? "'Aref Ruqaa',Georgia,serif" : "'Reenie Beanie','Comic Sans MS',cursive";
  return `<!doctype html><html lang="${ar ? 'ar' : 'en'}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;500&family=Reenie+Beanie&family=Amiri:ital@0;1&family=IBM+Plex+Sans+Arabic:wght@300;500&family=Aref+Ruqaa&display=swap" rel="stylesheet"></head>
<body style="margin:0;background:#FBF7F1;">
<span style="display:none;font-size:1px;color:#FBF7F1">${t.pre}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F1"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E0D6">
<tr><td style="background:#1C1511;padding:44px 40px 40px;text-align:${align}" dir="${dir}">
<p style="margin:0 0 18px;font:500 11px ${sans};letter-spacing:${ar ? '0' : '.18em'};text-transform:${ar ? 'none' : 'uppercase'};color:#CFC3B6">Human by Design</p>
<h1 style="margin:0;font:400 44px/1.05 ${serif};color:#F4EEE6">${t.h}</h1>
<p style="margin:22px 0 0;font:400 34px/1 ${hand};color:#E2402F">${esc(name)}</p>
</td></tr>
<tr><td style="padding:36px 40px 10px;text-align:${align}" dir="${dir}">
<p style="margin:0 0 14px;font:300 16px/1.7 ${sans};color:#2e2620">${t.hi}</p>
<p style="margin:0 0 14px;font:300 16px/1.7 ${sans};color:#2e2620">${t.p1}</p>
<p style="margin:0 0 26px;font:300 16px/1.7 ${sans};color:#2e2620">${t.p2}</p>
<p style="margin:0 0 26px"><a href="${esc(url)}" style="display:inline-block;background:#1C1511;color:#F4EEE6;text-decoration:none;font:500 15px ${sans};padding:15px 30px;border-radius:999px">${t.btn}</a></p>
<p style="margin:0 0 26px;font:300 13px/1.6 ${sans};color:#6F645C">${t.keep}<br><a href="${esc(url)}" style="color:#B8231B;word-break:break-all">${esc(url)}</a></p>
<p style="margin:0 0 30px;font:400 30px/1 ${hand};color:#B8231B">${t.love}</p>
</td></tr>
<tr><td style="padding:18px 40px 30px;border-top:1px solid #EFE7DD;text-align:${align}" dir="${dir}">
<p style="margin:0;font:300 12px/1.6 ${sans};color:#8a7f76">${t.disc}<br>humanbydesign.global</p>
</td></tr></table></td></tr></table></body></html>`;
}

async function sendReportEmail({ to, name, lang, url, pi }) {
  if (!process.env.RESEND_API_KEY || !to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { sent: false, reason: 'not_configured_or_no_email' };
  const ar = lang === 'ar';
  const subject = ar ? 'تقريرك جاهز يا ' + name + ' | تصميمك، بالتفصيل' : name + ', your report is ready | Your Design, Decoded';
  const text = (ar ? 'أهلا ' + name + '، تقريرك جاهز. افتحو من هون: ' : 'Hi ' + name + ', your report is ready. Open it here: ') + url + (ar ? '\n\nبكل حب، سيسي' : '\n\nWith love, Cici');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': 'report-' + pi },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY, subject, html: html(lang, name, url), text })
  });
  return { sent: res.ok, status: res.status };
}

// Reads the buyer's details back out of a Ziina payment intent's success_url (r = base64url JSON, lang).
function fromIntent(intent, site) {
  try {
    const u = new URL(String(intent.success_url || '').replace('{PAYMENT_INTENT_ID}', intent.id));
    const r = u.searchParams.get('r') || '', lang = u.searchParams.get('lang') === 'ar' ? 'ar' : 'en';
    let b = r.replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '=';
    const d = JSON.parse(Buffer.from(b, 'base64').toString('utf8'));
    const url = site + '/report.html?lang=' + lang + '&r=' + r + '&pi=' + encodeURIComponent(intent.id);
    return { r, lang, to: d.e, name: (d.n || '').trim() || (lang === 'ar' ? 'صديقي' : 'friend'), url };
  } catch (e) { return null; }
}

module.exports = { sendReportEmail, fromIntent };
