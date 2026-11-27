/// <reference types="node" />
import vm from 'node:vm'; import fs from 'node:fs';
import * as Astronomy from 'astronomy-engine';
import { chart, localToUtc, connection, hangingGates } from '../src/engine/hd';
const ctx: any = { Astronomy, Intl, Date, Math, Object }; ctx.globalThis = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('/home/claude/humanbydesign-media/site/hd-engine.js','utf8'), ctx);
const cases: [number,number,number,number,number,string][] = [[1990,5,14,8,30,'Asia/Beirut'],[1985,11,2,23,5,'Asia/Dubai'],[2001,1,20,4,45,'Europe/London'],[1977,7,7,12,0,'America/New_York'],[1995,3,3,17,20,'Asia/Riyadh']];
let ok = true;
for (const c of cases) {
  const u = localToUtc(...c); const a = chart(u); const b = ctx.HD.chart(ctx.HD.localToUtc(...c));
  const same = a.type===b.type && a.authority===b.authority && a.profile===b.profile && a.definition===b.definition && JSON.stringify(a.gates)===JSON.stringify(b.gates);
  ok = ok && same; console.log(c.join(' '), a.type, a.authority, a.profile, a.definition, same ? 'MATCH' : 'DIFF');
}
const x = chart(localToUtc(...cases[0])), y = chart(localToUtc(...cases[1]));
console.log(connection(x,y).channels, connection(x,y).together.type, hangingGates(x).length);
process.exit(ok?0:1);
