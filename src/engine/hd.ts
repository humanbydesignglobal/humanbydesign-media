// Human Design chart engine. Ported from the website's hd-engine.js so the app
// and humanbydesign.global always calculate exactly the same chart.
import * as Astronomy from 'astronomy-engine';

export type CentreId = 'Head' | 'Ajna' | 'Throat' | 'G' | 'Heart' | 'Spleen' | 'SolarPlexus' | 'Sacral' | 'Root';
export type TypeId = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
export type AuthorityId =
  | 'Emotional' | 'Sacral' | 'Splenic' | 'Ego Manifested' | 'Ego Projected' | 'Self-Projected' | 'Mental' | 'Lunar';
export type PlanetId =
  | 'Sun' | 'Earth' | 'North Node' | 'South Node' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export interface Activation { planet: PlanetId; gate: number; line: number; color: number; tone: number; lon: number }
export interface Channel { a: number; b: number; key: string; name: string; from: CentreId; to: CentreId }
export interface Chart {
  type: TypeId;
  authority: AuthorityId;
  definition: string;
  profile: string;
  defined: Partial<Record<CentreId, boolean>>;
  channels: Channel[];
  gates: number[];
  personality: Activation[];
  design: Activation[];
  designDate: Date;
  cross: number[];
}

const ORDER = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
export const CENTRES: CentreId[] = ['Head', 'Ajna', 'Throat', 'G', 'Heart', 'Spleen', 'SolarPlexus', 'Sacral', 'Root'];
export const CENTRE_GATES: Record<CentreId, number[]> = {
  Head: [64,61,63], Ajna: [47,24,4,17,43,11], Throat: [62,23,56,35,12,45,33,8,31,20,16],
  G: [7,1,13,10,25,46,2,15], Heart: [21,40,26,51], Spleen: [48,57,44,50,32,28,18],
  SolarPlexus: [6,37,22,36,30,55,49], Sacral: [5,14,29,59,9,3,42,27,34], Root: [53,60,52,19,39,41,58,38,54],
};
export const CHANNELS: [number, number, string][] = [
  [1,8,'Inspiration'],[2,14,'The Beat'],[3,60,'Mutation'],[4,63,'Logic'],[5,15,'Rhythm'],[6,59,'Intimacy'],
  [7,31,'The Alpha'],[9,52,'Concentration'],[10,20,'Awakening'],[10,34,'Exploration'],[10,57,'Perfected Form'],
  [11,56,'Curiosity'],[12,22,'Openness'],[13,33,'The Prodigal'],[16,48,'The Wavelength'],[17,62,'Acceptance'],
  [18,58,'Judgment'],[19,49,'Synthesis'],[20,34,'Charisma'],[20,57,'The Brainwave'],[21,45,'Money'],
  [23,43,'Structuring'],[24,61,'Awareness'],[25,51,'Initiation'],[26,44,'Surrender'],[27,50,'Preservation'],
  [28,38,'Struggle'],[29,46,'Discovery'],[30,41,'Recognition'],[32,54,'Transformation'],[34,57,'Power'],
  [35,36,'Transitoriness'],[37,40,'Community'],[39,55,'Emoting'],[42,53,'Maturation'],[47,64,'Abstraction'],
];
const MOTORS: CentreId[] = ['Sacral', 'Heart', 'SolarPlexus', 'Root'];
export const GATE_CENTRE: Record<number, CentreId> = {};
(Object.keys(CENTRE_GATES) as CentreId[]).forEach((c) => CENTRE_GATES[c].forEach((g) => { GATE_CENTRE[g] = c; }));

const norm = (x: number) => { x %= 360; return x < 0 ? x + 360 : x; };

function gateLine(lon: number) {
  const x = norm(lon - 302);
  const idx = Math.floor(x / 5.625);
  const inGate = x - idx * 5.625;
  const line = Math.floor(inGate / 0.9375) + 1;
  const inLine = inGate - (line - 1) * 0.9375;
  const color = Math.min(6, Math.floor(inLine / 0.15625) + 1);
  const inColor = inLine - (color - 1) * 0.15625;
  const tone = Math.min(6, Math.floor(inColor / (0.15625 / 6)) + 1);
  return { gate: ORDER[idx], line, color, tone, lon };
}
const sunLon = (date: Date) => Astronomy.SunPosition(date).elon;
const bodyLon = (body: Astronomy.Body, date: Date) => Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;

/** True (osculating) lunar node: from the Moon's position and velocity, in ecliptic coordinates of date. */
function trueNode(date: Date) {
  const t = Astronomy.MakeTime(date);
  const st = Astronomy.GeoMoonState(t);
  const rot = Astronomy.Rotation_EQJ_ECT(t);
  const r = Astronomy.RotateVector(rot, new Astronomy.Vector(st.x, st.y, st.z, t));
  const v = Astronomy.RotateVector(rot, new Astronomy.Vector(st.vx, st.vy, st.vz, t));
  const hx = r.y * v.z - r.z * v.y;
  const hy = r.z * v.x - r.x * v.z;
  return norm((Math.atan2(hx, -hy) * 180) / Math.PI);
}

export function activations(date: Date): Activation[] {
  const B = Astronomy.Body;
  const s = sunLon(date), n = trueNode(date);
  const list: [PlanetId, number][] = [
    ['Sun', s], ['Earth', s + 180], ['North Node', n], ['South Node', n + 180],
    ['Moon', Astronomy.EclipticGeoMoon(date).lon],
    ['Mercury', bodyLon(B.Mercury, date)], ['Venus', bodyLon(B.Venus, date)], ['Mars', bodyLon(B.Mars, date)],
    ['Jupiter', bodyLon(B.Jupiter, date)], ['Saturn', bodyLon(B.Saturn, date)], ['Uranus', bodyLon(B.Uranus, date)],
    ['Neptune', bodyLon(B.Neptune, date)], ['Pluto', bodyLon(B.Pluto, date)],
  ];
  return list.map(([planet, lon]) => ({ planet, ...gateLine(norm(lon)) }));
}

function designDate(birth: Date) {
  const target = norm(sunLon(birth) - 88);
  let t = new Date(birth.getTime() - 88.5 * 86400000);
  for (let i = 0; i < 8; i++) {
    let diff = norm(sunLon(t) - target);
    if (diff > 180) diff -= 360;
    t = new Date(t.getTime() - (diff / 0.98565) * 86400000);
  }
  return t;
}

function tzOffsetMs(utcMs: number, tz: string) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p: Record<string, string> = {};
  f.formatToParts(new Date(utcMs)).forEach((x) => { p[x.type] = x.value; });
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - utcMs;
}

/** Local birth time in an IANA time zone → UTC instant. */
export function localToUtc(y: number, mo: number, d: number, h: number, mi: number, tz: string) {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let utc = guess - tzOffsetMs(guess, tz);
  utc = guess - tzOffsetMs(utc, tz);
  return new Date(utc);
}

/** Builds definition, type and authority from a set of active gates. */
export function analyseGates(gateSet: Set<number>) {
  const channels: Channel[] = CHANNELS.filter(([a, b]) => gateSet.has(a) && gateSet.has(b)).map(([a, b, name]) => ({
    a, b, key: `${a}-${b}`, name, from: GATE_CENTRE[a], to: GATE_CENTRE[b],
  }));
  const defined: Partial<Record<CentreId, boolean>> = {};
  channels.forEach((c) => { defined[c.from] = true; defined[c.to] = true; });
  const adj: Partial<Record<CentreId, CentreId[]>> = {};
  channels.forEach((c) => {
    (adj[c.from] = adj[c.from] || []).push(c.to);
    (adj[c.to] = adj[c.to] || []).push(c.from);
  });
  const reach = (start: CentreId) => {
    const seen: Partial<Record<CentreId, boolean>> = { [start]: true };
    const st = [start];
    while (st.length) {
      const c = st.pop()!;
      (adj[c] || []).forEach((n) => { if (!seen[n]) { seen[n] = true; st.push(n); } });
    }
    return seen;
  };
  const throatReach = defined.Throat ? reach('Throat') : {};
  const motorToThroat = MOTORS.some((m) => defined[m] && throatReach[m]);
  let type: TypeId;
  if (defined.Sacral) type = motorToThroat ? 'Manifesting Generator' : 'Generator';
  else if (motorToThroat) type = 'Manifestor';
  else if (Object.keys(defined).length) type = 'Projector';
  else type = 'Reflector';
  let authority: AuthorityId;
  if (defined.SolarPlexus) authority = 'Emotional';
  else if (defined.Sacral) authority = 'Sacral';
  else if (defined.Spleen) authority = 'Splenic';
  else if (defined.Heart) authority = throatReach.Heart ? 'Ego Manifested' : 'Ego Projected';
  else if (defined.G) authority = 'Self-Projected';
  else if (type === 'Reflector') authority = 'Lunar';
  else authority = 'Mental';
  let comps = 0;
  const seen: Partial<Record<CentreId, boolean>> = {};
  (Object.keys(defined) as CentreId[]).forEach((c) => {
    if (!seen[c]) { comps++; Object.keys(reach(c)).forEach((k) => { seen[k as CentreId] = true; }); }
  });
  const definition =
    ['No Definition', 'Single Definition', 'Split Definition', 'Triple Split Definition', 'Quadruple Split Definition'][comps] ||
    'Split Definition';
  return { type, authority, definition, defined, channels };
}

export function chart(birthUtc: Date): Chart {
  const dd = designDate(birthUtc);
  const personality = activations(birthUtc);
  const design = activations(dd);
  const gateSet = new Set<number>();
  personality.concat(design).forEach((a) => gateSet.add(a.gate));
  const a = analyseGates(gateSet);
  return {
    ...a,
    profile: `${personality[0].line}/${design[0].line}`,
    gates: [...gateSet].sort((x, y) => x - y),
    personality,
    design,
    designDate: dd,
    cross: [personality[0].gate, personality[1].gate, design[0].gate, design[1].gate],
  };
}

export const STRATEGY: Record<TypeId, string> = {
  Generator: 'respond', 'Manifesting Generator': 'respondInform', Projector: 'invitation', Manifestor: 'inform', Reflector: 'lunar',
};

/** The other gate of every channel this gate belongs to. */
export function partnerGates(gate: number) {
  return CHANNELS.filter(([a, b]) => a === gate || b === gate).map(([a, b, name]) => ({ other: a === gate ? b : a, key: `${a}-${b}`, name }));
}

/** Gates you carry whose channel partner you don't: they're waiting for someone (or a transit) to complete them. */
export function hangingGates(c: Chart) {
  const set = new Set(c.gates);
  const out: { gate: number; other: number; key: string }[] = [];
  c.gates.forEach((g) => partnerGates(g).forEach((p) => { if (!set.has(p.other)) out.push({ gate: g, other: p.other, key: p.key }); }));
  return out;
}

export type ConnectionKind = 'spark' | 'shared' | 'teach' | 'bend';
export interface Connection { key: string; kind: ConnectionKind; from: 'a' | 'b' | 'both' }

/**
 * How two charts meet, channel by channel.
 * spark  = electromagnetic: each of you brings one half (attraction, chemistry).
 * shared = companionship: you both have the whole channel (easy, familiar).
 * teach  = dominance: one has the whole channel, the other has neither half.
 * bend   = compromise: one has the whole channel, the other has one half.
 */
export function connection(a: Chart, b: Chart) {
  const A = new Set(a.gates), B = new Set(b.gates);
  const out: Connection[] = [];
  CHANNELS.forEach(([x, y]) => {
    const key = `${x}-${y}`;
    const aFull = A.has(x) && A.has(y), bFull = B.has(x) && B.has(y);
    const aAny = A.has(x) || A.has(y), bAny = B.has(x) || B.has(y);
    if (aFull && bFull) out.push({ key, kind: 'shared', from: 'both' });
    else if (aFull) out.push({ key, kind: bAny ? 'bend' : 'teach', from: 'a' });
    else if (bFull) out.push({ key, kind: aAny ? 'bend' : 'teach', from: 'b' });
    else if ((A.has(x) && B.has(y)) || (A.has(y) && B.has(x))) out.push({ key, kind: 'spark', from: 'both' });
  });
  const together = analyseGates(new Set([...a.gates, ...b.gates]));
  return { channels: out, together };
}

/** Today's planets (one side only: transits have no Design side). */
export function transits(now = new Date()) {
  return activations(now);
}

/** Validates and parses typed birth data. */
export function parseBirth(dateStr: string, timeStr: string) {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const tm = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  if (!dm || !tm) return null;
  const [y, mo, d, h, mi] = [+dm[1], +dm[2], +dm[3], +tm[1], +tm[2]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || y < 1900 || y > 2100) return null;
  return { y, mo, d, h, mi };
}

/**
 * The four "variables" (the arrows beside a chart), from the Sun and North Node
 * colors and tones. Tones 1-3 point left, 4-6 point right.
 */
export function variables(c: Chart) {
  const dSun = c.design[0], pSun = c.personality[0];
  const dNode = c.design.find((a) => a.planet === 'North Node')!;
  const pNode = c.personality.find((a) => a.planet === 'North Node')!;
  const side = (t: number) => (t <= 3 ? 'left' : 'right') as 'left' | 'right';
  return {
    digestion: { color: dSun.color, side: side(dSun.tone) },
    sense: { tone: dSun.tone },
    environment: { color: dNode.color, side: side(dNode.tone) },
    perspective: { color: pNode.color, side: side(pNode.tone) },
    motivation: { color: pSun.color, side: side(pSun.tone) },
  };
}

export type CrossAngle = 'right' | 'left' | 'jux';
export function crossAngle(c: Chart): CrossAngle {
  const [p, d] = c.profile.split('/').map(Number);
  if (p === 4 && d === 1) return 'jux';
  return p >= 5 ? 'left' : 'right';
}
