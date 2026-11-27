import { chart, localToUtc, variables, crossAngle } from '../src/engine/hd';
const c = chart(localToUtc(1991, 1, 7, 18, 30, 'Asia/Beirut'));
console.log(c.type, c.authority, c.profile, c.cross, crossAngle(c), JSON.stringify(variables(c)));
console.log('dSun', c.design[0], 'pSun', c.personality[0]);
