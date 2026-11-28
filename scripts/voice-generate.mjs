// Runs on GitHub Actions. Makes an MP3 in Cici's ElevenLabs voice for every
// script that is new or changed, into <site>/voice/, and updates manifest.json.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
const SITE = process.env.SITE_DIR; // e.g. site-repo/site
const VOICE_NAME = (process.env.VOICE_NAME || 'Cici English').toLowerCase();
const MODEL = process.env.VOICE_MODEL || 'eleven_multilingual_v2';
// Arabic mixes in English Human Design terms: eleven_v3 switches languages mid-sentence and keeps Cici's English accent.
const MODEL_AR = process.env.VOICE_MODEL_AR || 'eleven_v3';
if (!KEY) { console.log('No ELEVENLABS_API_KEY secret yet. Nothing to do.'); process.exit(0); }

const api = (p, init = {}) => fetch('https://api.elevenlabs.io' + p, { ...init, headers: { 'xi-api-key': KEY, 'content-type': 'application/json', ...(init.headers || {}) } });

try {
const vr = await api('/v1/voices');
if (!vr.ok) throw new Error('voices ' + vr.status + ' ' + (await vr.text()));
const voices = (await vr.json()).voices;
// Only voices Cici approved are used: exactly "Cici English" and "Cici Lebanese". Without them, no audio is published.
const voice = voices.find((v) => v.name.toLowerCase() === VOICE_NAME) || null;
console.log(voice ? 'English voice: ' + voice.name : '::warning::No "' + VOICE_NAME + '" voice yet, so English audio is off.');
// Arabic needs a voice cloned from Cici speaking Lebanese. Until it exists, no Arabic audio is published.
const AR_NAME = (process.env.VOICE_NAME_AR || 'Cici Lebanese').toLowerCase();
const voiceAr = voices.find((v) => v.name.toLowerCase() === AR_NAME) || null;
console.log(voiceAr ? 'Arabic voice: ' + voiceAr.name : '::warning::No "' + AR_NAME + '" voice yet, so Arabic audio is off.');

const scripts = JSON.parse(readFileSync('voice/scripts.json', 'utf8'));
const dir = join(SITE, 'voice');
const manPath = join(dir, 'manifest.json');
const man = existsSync(manPath) ? JSON.parse(readFileSync(manPath, 'utf8')) : { clips: {} };
const limit = Number(process.env.MAX_CHARS || 40000);
let used = 0, made = 0;
for (const s of scripts) {
  if (s.lang === 'ar' && !voiceAr) { delete man.clips[s.key]; continue; }
  if (s.lang === 'en' && !voice) { delete man.clips[s.key]; continue; }
  const vo = s.lang === 'ar' ? voiceAr : voice;
  const model = s.lang === 'ar' ? MODEL_AR : MODEL;
  const hash = createHash('sha1').update([vo.voice_id, model, s.text].join('|')).digest('hex').slice(0, 10);
  if (man.clips[s.key]?.hash === hash) continue;
  if (used + s.text.length > limit) { console.log('Stopping at the character limit for this run:', limit); break; }
  const r = await api(`/v1/text-to-speech/${vo.voice_id}?output_format=mp3_44100_64`, {
    method: 'POST',
    body: JSON.stringify(s.lang === 'ar'
      ? { text: s.text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.85, use_speaker_boost: true } }
      : { text: s.text, model_id: model, language_code: 'en', voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true } }),
  });
  if (!r.ok) throw new Error(s.key + ' ' + r.status + ' ' + (await r.text()));
  const file = `${s.key}-${hash}.mp3`;
  mkdirSync(dirname(join(dir, file)), { recursive: true });
  writeFileSync(join(dir, file), Buffer.from(await r.arrayBuffer()));
  man.clips[s.key] = { hash, file };
  used += s.text.length; made++;
  console.log('made', file);
}
man.voice = voice?.name || null; man.model = MODEL; man.modelAr = MODEL_AR; man.updated = new Date().toISOString();
writeFileSync(manPath, JSON.stringify(man, null, 1) + '\n');
console.log(`Done: ${made} new clips, ${used} characters.`);
} catch (e) {
  console.log('::error::' + String(e?.message || e).replace(/\n/g, ' ').slice(0, 900));
  process.exit(1);
}
