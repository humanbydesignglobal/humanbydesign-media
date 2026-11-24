// Sends all five welcome emails right now to Cici only, to preview them.
// /.netlify/functions/welcome-test?type=Projector&authority=Self-Projected&lang=en
const { scheduleWelcome, fromRequest } = require('../lib/welcome');
exports.handler = async (event) => {
  const q = event.queryStringParameters || {};
  const r = Buffer.from(JSON.stringify({ n: 'Cici', e: 'cici@humanbydesign.global', d: '1990-01-01', t: '12:00', z: 'Asia/Dubai', p: 'Beirut' })).toString('base64url');
  const v = fromRequest({ email: 'cici@humanbydesign.global', name: 'Cici', type: q.type || 'Projector', authority: q.authority || 'Self-Projected', lang: q.lang, r });
  if (!v) return { statusCode: 400, body: 'bad type or authority' };
  const out = await scheduleWelcome(v, { to: 'cici@humanbydesign.global', now_send: true, tag: 'test-' + Date.now() });
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(out) };
};
