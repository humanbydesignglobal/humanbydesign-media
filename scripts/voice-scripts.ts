// Writes voice/scripts.json: every text the app can play in Cici's voice.
import { writeFileSync } from 'node:fs';
import { LESSONS } from '../src/content/lessons';
import { DAILY } from '../src/content/extra';

// In Arabic audio, Human Design terms are said in English, in Cici's own English accent.
const EN_TERMS: [RegExp, string][] = [
  [/(ال)?هيومان ديزاين/g, 'Human Design'],
  [/ال(مانفستنج جنريتر)/g, 'الـ Manifesting Generator'], [/مانفستنج جنريتر/g, 'Manifesting Generator'],
  [/الجنريتر/g, 'الـ Generator'], [/جنريتر/g, 'Generator'],
  [/البروجكتورز/g, 'الـ Projectors'], [/البروجكتور/g, 'الـ Projector'], [/بروجكتور/g, 'Projector'],
  [/المانفستر/g, 'الـ Manifestor'], [/مانفستر/g, 'Manifestor'],
  [/الرفلكتور/g, 'الـ Reflector'], [/رفلكتور/g, 'Reflector'],
  [/السولار بلكسس/g, 'الـ Solar Plexus'], [/السكرال/g, 'الـ Sacral'], [/السبلين/g, 'الـ Spleen'],
  [/الثروت/g, 'الـ Throat'], [/الهارت/g, 'الـ Heart'], [/الأجنا/g, 'الـ Ajna'], [/الروت/g, 'الـ Root'], [/الهيد/g, 'الـ Head'],
  [/الـG/g, 'الـ G centre'], [/موتور/g, 'motor'], [/إيموشنال/g, 'emotional'],
  [/الـ(?=[A-Za-z])/g, 'الـ '],
];
const toVoice = (lang: 'en' | 'ar', s: string) => (lang === 'ar' ? EN_TERMS.reduce((x, [re, to]) => x.replace(re, to), s) : s);

const TRY = { en: 'Try this.', ar: 'جرّب هيدا.' } as const;
const out: { key: string; lang: 'en' | 'ar'; text: string }[] = [];
for (const lang of ['en', 'ar'] as const) {
  for (const l of LESSONS[lang]) {
    out.push({ key: `${lang}/lesson-${l.id}`, lang, text: toVoice(lang, [l.title + '.', ...l.body, TRY[lang], l.tryThis].join('\n\n')) });
  }
  for (const [type, tips] of Object.entries(DAILY[lang])) {
    tips.forEach((tip, i) => out.push({ key: `${lang}/daily-${type.replace(/\s+/g, '')}-${i}`, lang, text: toVoice(lang, tip) }));
  }
}
writeFileSync('voice/scripts.json', JSON.stringify(out, null, 1) + '\n');
console.log(out.length, 'clips,', out.reduce((s, x) => s + x.text.length, 0), 'characters');
