// Everything in the Learn library, as plain entries for lists and search.
import { CENTRES, CHANNELS, GATE_CENTRE, partnerGates, type AuthorityId, type CentreId, type TypeId } from '../engine/hd';
import type { Content } from '../state/AppState';
import { AUTH_LABELS, CENTRE_LABELS, CHANNEL_AR, TYPE_LABELS } from './extra';
import { LESSONS } from './lessons';

export type Kind = 'lesson' | 'type' | 'authority' | 'centre' | 'profile' | 'channel' | 'gate';
export interface Entry { kind: Kind; id: string; title: string; sub: string; search: string }

export const TYPES: TypeId[] = ['Generator', 'Manifesting Generator', 'Projector', 'Manifestor', 'Reflector'];
export const AUTHS: AuthorityId[] = ['Emotional', 'Sacral', 'Splenic', 'Ego Manifested', 'Ego Projected', 'Self-Projected', 'Mental', 'Lunar'];
export const PROFILES = ['1/3', '1/4', '2/4', '2/5', '3/5', '3/6', '4/6', '4/1', '5/1', '5/2', '6/2', '6/3'];

export function buildLibrary(lang: 'en' | 'ar', c: Content): Record<Kind, Entry[]> {
  const gates = c.gates as Record<string, { name: string; text: string }>;
  const chans = c.channels as Record<string, { name: string; text: string }>;
  const lines = c.lines as Record<string, { name: string; text: string }>;
  const profiles = c.profiles as Record<string, string>;
  const auths = c.authorities as Record<string, { summary: string }>;
  const e = (kind: Kind, id: string, title: string, sub: string, body = ''): Entry => ({ kind, id, title, sub, search: `${title} ${sub} ${body} ${id}`.toLowerCase() });
  return {
    lesson: LESSONS[lang].map((l) => e('lesson', l.id, l.title, l.note, l.body.join(' '))),
    type: TYPES.map((t) => e('type', t, TYPE_LABELS[lang][t].name, TYPE_LABELS[lang][t].strategy, `${t} ${TYPE_LABELS[lang][t].gift}`)),
    authority: AUTHS.map((a) => e('authority', a, AUTH_LABELS[lang][a], firstSentence(auths[a]?.summary), a)),
    centre: CENTRES.map((k: CentreId) => e('centre', k, CENTRE_LABELS[lang][k], c.centres[k].does, k)),
    profile: PROFILES.map((p) => {
      const [a, b] = p.split('/');
      return e('profile', p, p, `${lines[a]?.name} / ${lines[b]?.name}`, profiles[p]);
    }),
    channel: CHANNELS.map(([a, b]) => {
      const k = `${a}-${b}`;
      return e('channel', k, chans[k]?.name ?? k, `${k} · ${CENTRE_LABELS[lang][GATE_CENTRE[a]]} – ${CENTRE_LABELS[lang][GATE_CENTRE[b]]}`, lang === 'ar' ? CHANNEL_AR[k] : chans[k]?.text);
    }),
    gate: Array.from({ length: 64 }, (_, i) => i + 1).map((g) => e('gate', String(g), `${g} · ${gates[g]?.name}`, CENTRE_LABELS[lang][GATE_CENTRE[g]], gates[g]?.text)),
  };
}

export function gateChannels(g: number) {
  return partnerGates(g).map((p) => p.key);
}

function firstSentence(s?: string) {
  if (!s) return '';
  const m = s.match(/^.*?[.!؟?](\s|$)/);
  return (m ? m[0] : s).trim();
}
