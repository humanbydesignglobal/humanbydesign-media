// One-off A/B samples: voice/tests.json -> <site>/voice/test/<name>.mp3. Also lists the account's voices.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const KEY = process.env.ELEVENLABS_API_KEY, SITE = process.env.SITE_DIR;
if (!KEY || !existsSync('voice/tests.json')) process.exit(0);
const api = (p, init = {}) => fetch('https://api.elevenlabs.io' + p, { ...init, headers: { 'xi-api-key': KEY, 'content-type': 'application/json' } });
try {
  const voices = (await (await api('/v1/voices')).json()).voices;
  console.log('::notice::Voices: ' + voices.map((v) => `${v.name} [${v.category}] ${v.labels?.accent || ''} ${v.labels?.language || ''}`).join(' | '));
  const dir = join(SITE, 'voice', 'test'); mkdirSync(dir, { recursive: true });
  for (const t of JSON.parse(readFileSync('voice/tests.json', 'utf8'))) {
    const v = voices.find((x) => x.name === t.voice);
    if (!v) { console.log('::warning::no voice ' + t.voice); continue; }
    const r = await api(`/v1/text-to-speech/${v.voice_id}?output_format=mp3_44100_64`, { method: 'POST', body: JSON.stringify({ text: t.text, model_id: t.model, ...(t.language_code ? { language_code: t.language_code } : {}), voice_settings: { stability: t.stability ?? 0.5, similarity_boost: 0.9, use_speaker_boost: true, ...(t.speed ? { speed: t.speed } : {}) } }) });
    if (!r.ok) { console.log('::warning::' + t.name + ' ' + r.status + ' ' + (await r.text()).slice(0, 300)); continue; }
    writeFileSync(join(dir, t.name + '.mp3'), Buffer.from(await r.arrayBuffer()));
    console.log('made', t.name);
  }
} catch (e) { console.log('::error::' + String(e?.message || e).slice(0, 900)); process.exit(1); }
