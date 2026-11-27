// Runs on GitHub Actions. Makes an MP3 in Cici's ElevenLabs voice for every
// script that is new or changed, into <site>/voice/, and updates manifest.json.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
const SITE = process.env.SITE_DIR; // e.g. site-repo/site
const VOICE_NAME = (process.env.VOICE_NAME || 'Cici').toLowerCase();
const MODEL = process.env.VOICE_MODEL || 'eleven_multilingual_v2';
if (!KEY) { console.log('No ELEVENLABS_API_KEY secret yet. Nothing to do.'); process.exit(0); }

const api = (p, init = {}) => fetch('https://api.elevenlabs.io' + p, { ...init, headers: { 'xi-api-key': KEY, 'content-type': 'application/json', ...(init.headers || {}) } });

process.on('unhandledRejection', (e) => { console.log('::error::' + String(e?.message || e).replace(/\n/g, ' ').slice(0, 900)); process.exit(1); });
const vr = await api('/v1/voices');
if (!vr.ok) throw new Error('voices ' + vr.status + ' ' + (await vr.text()));
const voices = (await vr.json()).voices;
const voice = voices.find((v) => v.name.toLowerCase() === VOICE_NAME) || voices.find((v) => v.name.toLowerCase().includes(VOICE_NAME));
if (!voice) throw new Error('No voice named like "' + VOICE_NAME + '". Voices: ' + voices.map((v) => v.name).join(', '));
console.log('Voice:', voice.name, voice.voice_id, 'model', MODEL);

const scripts = JSON.parse(readFileSync('voice/scripts.json', 'utf8'));
const dir = join(SITE, 'voice');
const manPath = join(dir, 'manifest.json');
const man = existsSync(manPath) ? JSON.parse(readFileSync(manPath, 'utf8')) : { clips: {} };
const limit = Number(process.env.MAX_CHARS || 40000);
let used = 0, made = 0;
for (const s of scripts) {
  const hash = createHash('sha1').update([voice.voice_id, MODEL, s.text].join('|')).digest('hex').slice(0, 10);
  if (man.clips[s.key]?.hash === hash) continue;
  if (used + s.text.length > limit) { console.log('Stopping at the character limit for this run:', limit); break; }
  const r = await api(`/v1/text-to-speech/${voice.voice_id}?output_format=mp3_44100_64`, {
    method: 'POST',
    body: JSON.stringify({ text: s.text, model_id: MODEL, language_code: s.lang, voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true } }),
  });
  if (!r.ok) throw new Error(s.key + ' ' + r.status + ' ' + (await r.text()));
  const file = `${s.key}-${hash}.mp3`;
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), Buffer.from(await r.arrayBuffer()));
  man.clips[s.key] = { hash, file };
  used += s.text.length; made++;
  console.log('made', file);
}
man.voice = voice.name; man.model = MODEL; man.updated = new Date().toISOString();
writeFileSync(manPath, JSON.stringify(man, null, 1) + '\n');
console.log(`Done: ${made} new clips, ${used} characters.`);
