import vm from 'node:vm'; import fs from 'node:fs';
const dir='/home/claude/humanbydesign-media/site/';
const ctx={window:{},console}; ctx.globalThis=ctx; vm.createContext(ctx);
for (const f of ['hbd-data.js','ar-guide.js','report-en.js','report-ar.js','report-en-deep.js','report-ar-deep.js']) vm.runInContext(fs.readFileSync(dir+f,'utf8'),ctx);
for (const k of Object.keys(ctx.window)) { const v=ctx.window[k]; console.log(k, Object.keys(v).join(',')); }
const d=ctx.window.HBR_EN_DEEP||ctx.window[Object.keys(ctx.window).find(k=>/DEEP/.test(k)&&/EN/.test(k))];
if(d) for (const k of Object.keys(d)) console.log(' deep',k, JSON.stringify(d[k]).slice(0,200));
const ar=ctx.window.HBD_AR; console.log('AR CHD', JSON.stringify(ar.CHD['1-8'])); console.log('AR CEN', JSON.stringify(ar.CEN.Spleen)); console.log('AR LN', JSON.stringify(ar.LN[2]));
console.log('EN CEN', JSON.stringify(ctx.window.HBD_EN.CEN.Spleen)); console.log('EN AU keys', Object.keys(ctx.window.HBD_EN.AU));
console.log('AR S keys', Object.keys(ar.S).slice(0,80).join(','));
