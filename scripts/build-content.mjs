// Builds the app's content library from the website's content files
// (humanbydesign-media/site). Run: node scripts/build-content.mjs [path-to-site]
// The free tier shows the guide-level text; the deep fields are the app's
// paid "full reading" (My Chart one-time purchase, or Silver/Gold).
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';

const site = process.argv[2] || '/home/claude/humanbydesign-media/site';
const ctx = { window: {}, console };
ctx.globalThis = ctx;
vm.createContext(ctx);
for (const f of ['hbd-data.js', 'ar-guide.js', 'report-en.js', 'report-ar.js']) {
  vm.runInContext(fs.readFileSync(path.join(site, f), 'utf8'), ctx);
}
const W = ctx.window;

const strip = (s) =>
  String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

// Cici's rule: in Arabic, centre names are the English names in Arabic letters.
const arFix = (s) =>
  strip(s)
    .replace(/الضفيرة الشمسية/g, 'السولار بلكسس')
    .replace(/الطحال/g, 'السبلين')
    .replace(/طحال/g, 'سبلين');

const TYPES = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
const AUTHS = ['Emotional', 'Sacral', 'Splenic', 'Ego Manifested', 'Ego Projected', 'Self-Projected', 'Mental', 'Lunar'];
const CENTRES = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'SolarPlexus', 'Sacral', 'Root'];

function build(lang) {
  const G = lang === 'en' ? W.HBD_EN : W.HBD_AR; // free guide
  const R = lang === 'en' ? W.HBR_EN : W.HBR_AR; // report library (Lebanese in AR)
  const fx = lang === 'en' ? strip : arFix;
  const out = { types: {}, authorities: {}, profiles: {}, definitions: {}, centres: {}, gates: {}, lines: {}, planets: {} };

  for (const t of TYPES) {
    out.types[t] = {
      summary: fx(lang === 'en' ? G.T[t].d : R.TYPE[t].aura),
      aura: fx(R.TYPE[t].aura),
      experiment: fx(R.EXP[t]),
      // Full reading (paid in the app: My Chart, Silver or Gold)
      strat: fx(R.TYPE[t].strat), signs: fx(R.TYPE[t].signs), work: fx(R.TYPE[t].work),
      love: fx(R.TYPE[t].love), rest: fx(R.TYPE[t].rest),
    };
  }
  for (const a of AUTHS) {
    out.authorities[a] = { summary: fx(lang === 'en' ? G.AU[a] : R.AUTH[a]?.feel ?? G.AU[a]), feel: fx(R.AUTH[a]?.feel ?? G.AU[a]),
      scene: fx(R.AUTH[a]?.scene), trap: fx(R.AUTH[a]?.trap), practice: fx(R.AUTH[a]?.practice) };
  }
  for (const p of Object.keys(R.PROFILE)) out.profiles[p] = fx(R.PROFILE[p]);
  for (const d of Object.keys(R.DEF)) out.definitions[d] = fx(R.DEF[d]);
  for (const c of CENTRES) {
    const x = R.CENTRE[c];
    out.centres[c] = { does: fx(x.does), defined: fx(x.def), open: fx(x.open), question: fx(x.q), trap: fx(x.trap), wisdom: fx(x.wisdom) };
  }
  for (let g = 1; g <= 64; g++) {
    out.gates[g] = { name: fx(G.GN[g]?.[0] ?? G.JXN?.[g]), text: fx(R.GATE[g]) };
  }
  for (let l = 1; l <= 6; l++) out.lines[l] = { name: fx(G.LN[l][0]), text: fx(R.LINE[l]) };
  for (const p of Object.keys(R.PLANET)) out.planets[p] = { name: fx(G.PL?.[p] || p), text: fx(R.PLANET[p]) };

  // Channel names (descriptions for Arabic are written in Lebanese in src/content/extra.ts)
  out.channels = {};
  for (const k of Object.keys(G.CHD)) out.channels[k] = { name: fx(G.CHD[k][0]), text: lang === 'en' ? fx(G.CHD[k][1]) : '' };
  out.circuitOf = W.HBR_EN.CH_CIRCUIT;
  // Incarnation cross: names and themes (Arabic right-angle themes are rewritten in Lebanese in src/content/purpose.ts)
  out.cross = {
    raxName: lang === 'en' ? Object.fromEntries(Object.keys(G.RAXN).map((k) => [k, k])) : Object.fromEntries(Object.entries(G.RAXNM).map(([k, v]) => [k, fx(v)])),
    laxName: lang === 'en' ? Object.fromEntries(Object.keys(G.LAXN).map((k) => [k, k])) : Object.fromEntries(Object.entries(G.LAXNM).map(([k, v]) => [k, fx(v)])),
    raxTheme: Object.fromEntries(Object.entries(G.RAXN).map(([k, v]) => [k, fx(v)])),
    laxTheme: Object.fromEntries(Object.entries(G.LAXN).map(([k, v]) => [k, fx(v)])),
    jxName: Object.fromEntries(Object.entries(G.JXN).map(([k, v]) => [k, fx(v)])),
  };
  return out;
}

const outDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/content');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'en.json'), JSON.stringify(build('en'), null, 1));
fs.writeFileSync(path.join(outDir, 'ar.json'), JSON.stringify(build('ar'), null, 1));
fs.writeFileSync(
  path.join(outDir, 'draw.json'),
  JSON.stringify({ GP: W.HBD_DRAW.GP, CTRL: W.HBD_DRAW.CTRL, CH: W.HBD_DRAW.CH, SHP: W.HBD_DRAW.SHP, GLY: W.HBD_DRAW.GLY, RAXG: W.HBD_DRAW.RAXG, LAXG: W.HBD_DRAW.LAXG })
);
console.log('content written to', outDir);
