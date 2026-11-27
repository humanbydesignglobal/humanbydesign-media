// Writes voice/scripts.json: every text the app can play in Cici's voice.
import { writeFileSync } from 'node:fs';
import { LESSONS } from '../src/content/lessons';
import { DAILY } from '../src/content/extra';

const TRY = { en: 'Try this.', ar: 'جرّب هيدا.' } as const;
const out: { key: string; lang: 'en' | 'ar'; text: string }[] = [];
for (const lang of ['en', 'ar'] as const) {
  for (const l of LESSONS[lang]) {
    out.push({ key: `${lang}/lesson-${l.id}`, lang, text: [l.title + '.', ...l.body, TRY[lang], l.tryThis].join('\n\n') });
  }
  for (const [type, tips] of Object.entries(DAILY[lang])) {
    tips.forEach((tip, i) => out.push({ key: `${lang}/daily-${type.replace(/\s+/g, '')}-${i}`, lang, text: tip }));
  }
}
writeFileSync('voice/scripts.json', JSON.stringify(out, null, 1) + '\n');
console.log(out.length, 'clips,', out.reduce((s, x) => s + x.text.length, 0), 'characters');
