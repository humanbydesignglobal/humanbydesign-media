// Welcome sequence: five teaching emails after the free chart, scheduled through Resend (see content/welcome-emails.md).
// Cici's rule: teach, never pitch. The report appears only as a quiet P.S. link; the report page handles price and payment.
const crypto = require('crypto');
const EMAILS = require('./welcome-content.json');
const FROM = process.env.MAIL_FROM || 'Cici · Human by Design <cici@humanbydesign.global>';
const REPLY = process.env.MAIL_REPLY_TO || 'cici@humanbydesign.global';
const SITE = process.env.SITE_URL || 'https://humanbydesign.global';
const TYPES = ['Manifestor', 'Generator', 'Manifesting Generator', 'Projector', 'Reflector'];
const TYPE_AR = { 'Manifestor': 'مانفستر', 'Generator': 'جنريتر', 'Manifesting Generator': 'مانفستنج جنريتر', 'Projector': 'بروجكتور', 'Reflector': 'رفلكتور' };
// Engine authority keys -> the blocks in the content.
const AUTH = { 'Emotional': 'Emotional', 'Sacral': 'Sacral', 'Splenic': 'Splenic', 'Ego Manifested': 'Ego', 'Ego Projected': 'Ego', 'Ego': 'Ego',
  'Self-Projected': 'Self-Projected', 'Mental': 'Mental/Environmental', 'Lunar': 'Lunar' };
const AUTH_EN = { 'Emotional': 'Emotional', 'Sacral': 'Sacral', 'Splenic': 'Splenic', 'Ego': 'Ego', 'Self-Projected': 'Self-Projected', 'Mental/Environmental': 'Mental (Environmental)', 'Lunar': 'Lunar' };
const AUTH_AR = { 'Emotional': 'السلطة العاطفية', 'Sacral': 'سلطة السكرال', 'Splenic': 'سلطة السبلين', 'Ego': 'سلطة الإيغو', 'Self-Projected': 'سلطة الجي سنتر',
  'Mental/Environmental': 'السلطة الذهنية أو البيئية', 'Lunar': 'السلطة القمرية' };

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function secret() { return process.env.WELCOME_SECRET || process.env.RESEND_API_KEY || ''; }
function sign(s) { return crypto.createHmac('sha256', secret()).update(s).digest('base64url').slice(0, 22); }

// Fill merge fields and the little markdown used in the content (**bold**, [text](link)).
function fill(text, v, lang) {
  const ar = lang === 'ar';
  let t = text
    .replace(/\{name\}/g, esc(v.name)).replace(/\{type\}/g, esc(v.type)).replace(/\{type_ar\}/g, esc(TYPE_AR[v.type] || v.type))
    .replace(/\{authority\}/g, esc(AUTH_EN[v.auth] || v.auth)).replace(/\{authority_ar\}/g, esc(AUTH_AR[v.auth] || v.auth));
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:500;color:#1C1511">$1</strong>');
  t = t.replace(/\[([^\]]+)\]\(\{report_link\}\)/g, (m, a) => `<a href="${esc(v.reportUrl)}" style="color:#B8231B;text-decoration:underline">${a}</a>`);
  return ar ? '&#8207;' + t + '&#8207;' : t;
}

function section(e, lang, v) {
  const ar = lang === 'ar', dir = ar ? 'rtl' : 'ltr', align = ar ? 'right' : 'left';
  const sans = ar ? "'IBM Plex Sans Arabic',Arial,sans-serif" : "Inter,Helvetica,Arial,sans-serif";
  const p = `margin:0 0 16px;font:300 16px/1.75 ${sans};color:#2e2620;text-align:${align}`;
  let h = '';
  for (const b of e[lang].blocks) {
    if (b.only && b.only !== v.type && b.only !== v.auth) continue;
    if (b.ul) { h += `<ul style="margin:0 0 16px;padding-${ar ? 'right' : 'left'}:20px;font:300 16px/1.75 ${sans};color:#2e2620;text-align:${align}" dir="${dir}">` + b.ul.map(l => `<li style="margin:0 0 6px">${fill(l, v, lang)}</li>`).join('') + '</ul>'; continue; }
    const isSign = /^(With love|بكل حب)/.test(b.p), isPS = /^(P\.S\.|ملاحظة)/.test(b.p);
    if (isSign) { h += `<p style="margin:6px 0 22px;font:400 28px/1.15 ${ar ? "'Aref Ruqaa',Georgia,serif" : "'Reenie Beanie','Comic Sans MS',cursive"};color:#B8231B;text-align:${align}">${fill(b.p, v, lang)}</p>`; continue; }
    if (isPS) { h += `<p style="margin:0 0 16px;font:300 14px/1.7 ${sans};color:#6F645C;text-align:${align}">${fill(b.p, v, lang)}</p>`; continue; }
    h += `<p style="${p}">${fill(b.p, v, lang)}</p>`;
  }
  return `<tr><td style="padding:34px 40px 8px" dir="${dir}">${h}</td></tr>`;
}

function render(e, v, unsubUrl) {
  const first = v.lang === 'ar' ? 'ar' : 'en', second = first === 'ar' ? 'en' : 'ar';
  const foot = `<p style="margin:0 0 8px;font:300 12px/1.6 Inter,Helvetica,Arial,sans-serif;color:#8a7f76">Human Design is a tool for self-reflection. It is not medical, psychological or financial advice. Human Design was originated by Ra Uru Hu.<br>You're getting this because you asked for your chart at humanbydesign.global. <a href="${esc(unsubUrl)}" style="color:#8a7f76">Unsubscribe</a></p>
<p dir="rtl" style="margin:0;font:300 12px/1.6 'IBM Plex Sans Arabic',Arial,sans-serif;color:#8a7f76;text-align:right">&#8207;الهيومان ديزاين أداة لتتعرّف عحالك أكتر. مش نصيحة طبية أو نفسية أو مالية. <a href="${esc(unsubUrl)}" style="color:#8a7f76">إلغاء الاشتراك</a>&#8207;</p>`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500&family=Reenie+Beanie&family=IBM+Plex+Sans+Arabic:wght@300;500&family=Aref+Ruqaa&display=swap" rel="stylesheet"></head>
<body style="margin:0;background:#FBF7F1;"><span style="display:none;font-size:1px;color:#FBF7F1">${esc(e[first].preview)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F1"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E8E0D6">
<tr><td style="background:#1C1511;padding:22px 40px"><p style="margin:0;font:500 11px Inter,Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#CFC3B6">Human by Design</p></td></tr>
${section(e, first, v)}
<tr><td style="padding:0 40px"><div style="border-top:1px solid #EFE7DD"></div></td></tr>
${section(e, second, v)}
<tr><td style="padding:18px 40px 30px;border-top:1px solid #EFE7DD">${foot}</td></tr>
</table></td></tr></table></body></html>`;
}

function plain(e, v) {
  const strip = s => s.replace(/<br>/g, '\n').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\(\{report_link\}\)/g, '$1: ' + v.reportUrl);
  const one = lang => e[lang].blocks.filter(b => !(b.only && b.only !== v.type && b.only !== v.auth))
    .map(b => b.ul ? b.ul.map(l => '- ' + l).join('\n') : b.p).map(s => strip(s
      .replace(/\{name\}/g, v.name).replace(/\{type\}/g, v.type).replace(/\{type_ar\}/g, TYPE_AR[v.type] || v.type)
      .replace(/\{authority\}/g, AUTH_EN[v.auth] || v.auth).replace(/\{authority_ar\}/g, AUTH_AR[v.auth] || v.auth))).join('\n\n');
  const f = v.lang === 'ar' ? ['ar', 'en'] : ['en', 'ar'];
  return one(f[0]) + '\n\n---\n\n' + one(f[1]);
}

// Next 9:13 am Dubai (05:13 UTC) that is `day` calendar days after today in Dubai.
function sendTime(day, now) {
  const dubai = new Date(now.getTime() + 4 * 3600e3);
  return new Date(Date.UTC(dubai.getUTCFullYear(), dubai.getUTCMonth(), dubai.getUTCDate() + day, 5, 13)).toISOString();
}

// Schedules emails 5 down to 1, so each email's unsubscribe link can carry the ids of the emails that come after it.
async function scheduleWelcome(v, opts = {}) {
  const now = opts.now || new Date();
  const later = [];
  const results = [];
  for (const e of EMAILS.slice().reverse()) {
    const ids = later.join('.');
    const unsub = SITE + '/.netlify/functions/welcome-stop?i=' + encodeURIComponent(ids) + '&s=' + sign(ids) + '&lang=' + (v.lang === 'ar' ? 'ar' : 'en');
    const subjLang = v.lang === 'ar' ? 'ar' : 'en';
    const body = {
      from: FROM, to: [opts.to || v.email], reply_to: REPLY,
      subject: e[subjLang].subject.replace(/\{name\}/g, v.name),
      html: render(e, v, unsub), text: plain(e, v),
      headers: { 'List-Unsubscribe': '<' + unsub + '>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      tags: [{ name: 'sequence', value: 'welcome' }, { name: 'step', value: String(e.n) }]
    };
    if (!opts.now_send) body.scheduled_at = sendTime(e.day, now);
    const key = 'welcome-' + crypto.createHash('sha256').update((opts.to || v.email).toLowerCase() + (opts.tag || '')).digest('hex').slice(0, 24) + '-' + e.n;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json', 'Idempotency-Key': key },
      body: JSON.stringify(body)
    });
    const j = await res.json().catch(() => ({}));
    results.unshift({ n: e.n, ok: res.ok, status: res.status, at: body.scheduled_at || 'now', error: res.ok ? undefined : (j.message || j.name) });
    if (res.ok && j.id) later.unshift(j.id);
  }
  return results;
}

// Validates a request: r is the base64url JSON the guide makes ({n,e,d,t,z,p}); type/authority come from the chart.
function fromRequest(b) {
  const email = String(b.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return null;
  const type = TYPES.indexOf(b.type) >= 0 ? b.type : null;
  const auth = AUTH[b.authority] || null;
  const r = String(b.r || '');
  if (!type || !auth || !/^[A-Za-z0-9_-]{20,3000}$/.test(r)) return null;
  const lang = b.lang === 'ar' ? 'ar' : 'en';
  const name = String(b.name || '').trim().split(/\s+/)[0].slice(0, 40) || (lang === 'ar' ? 'صديقي' : 'friend');
  return { email, name, type, auth, lang, reportUrl: SITE + '/report.html?lang=' + lang + '&r=' + r };
}

module.exports = { scheduleWelcome, fromRequest, sign };
