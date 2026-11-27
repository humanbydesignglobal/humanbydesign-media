import React, { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { parseBirth } from '../engine/hd';
import { computeChart, useApp, type Place, type Profile } from '../state/AppState';
import { C } from '../theme';
import { Button, Field, Txt, useDir } from './ui';

type Draft = Omit<Profile, 'id' | 'createdAt'>;
const pad = (s: string) => (s.length === 1 ? '0' + s : s);
const digits = (s: string) => s.replace(/[^0-9٠-٩]/g, '').replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

export function BirthForm({ initial, other, onDone }: { initial?: Profile | null; other?: boolean; onDone: (p: Draft) => void }) {
  const { t, lang } = useApp();
  const { row, rtl } = useDir();
  const [name, setName] = useState(initial?.name ?? '');
  const [relation, setRelation] = useState(initial?.relation ?? '');
  const [y0, m0, d0] = (initial?.date ?? '--').split('-');
  const [h0, mi0] = (initial?.time ?? ':').split(':');
  const [day, setDay] = useState(d0 ?? ''), [month, setMonth] = useState(m0 ?? ''), [year, setYear] = useState(y0 ?? '');
  const [hour, setHour] = useState(h0 ?? ''), [minute, setMinute] = useState(mi0 ?? '');
  const [placeText, setPlaceText] = useState(initial ? label(initial.place, lang) : '');
  const [place, setPlace] = useState<Place | null>(initial?.place ?? null);
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [err, setErr] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onPlaceChange(text: string) {
    setPlaceText(text);
    setPlace(null);
    if (timer.current) clearTimeout(timer.current);
    const q = text.trim();
    if (q.length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const r = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?count=6&format=json&language=${lang}&name=${encodeURIComponent(q)}`
        );
        const j = await r.json();
        setResults((j.results || []).filter((p: Place) => p.timezone));
        setErr('');
      } catch {
        setErr(t.geoErr);
      } finally {
        setSearching(false);
      }
    }, 300);
  }

  function submit() {
    setErr('');
    if (!name.trim() || !day || !month || !year || !hour || minute === '') return setErr(t.needAll);
    if (!place) return setErr(t.pickPlace);
    const date = `${year}-${pad(month)}-${pad(day)}`, time = `${pad(hour)}:${pad(minute)}`;
    if (!parseBirth(date, time)) return setErr(t.badDate);
    const draft: Draft = { name: name.trim(), relation: relation.trim() || undefined, date, time, place };
    try { computeChart(draft); } catch { return setErr(t.badDate); }
    onDone(draft);
  }

  const num = (set: (s: string) => void, max: number) => (s: string) => set(digits(s).slice(0, max));

  return (
    <View style={{ gap: 18 }}>
      <Field label={t.name} value={name} onChangeText={setName} autoCapitalize="words" textContentType="givenName" />
      {other ? <Field label={t.relation} placeholder={t.relationPh} value={relation} onChangeText={setRelation} /> : null}
      <View style={{ gap: 6 }}>
        <Txt v="small">{t.date}</Txt>
        <View style={{ flexDirection: row, gap: 10 }}>
          <Field placeholder={t.day} value={day} onChangeText={num(setDay, 2)} keyboardType="number-pad" style={{ textAlign: 'center' }} />
          <Field placeholder={t.month} value={month} onChangeText={num(setMonth, 2)} keyboardType="number-pad" style={{ textAlign: 'center' }} />
          <View style={{ flex: 1.5 }}>
            <Field placeholder={t.year} value={year} onChangeText={num(setYear, 4)} keyboardType="number-pad" style={{ textAlign: 'center' }} />
          </View>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Txt v="small">{t.time}</Txt>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', alignSelf: rtl ? 'flex-end' : 'flex-start', width: 200 }}>
          <Field placeholder={t.hour} value={hour} onChangeText={num(setHour, 2)} keyboardType="number-pad" style={{ textAlign: 'center' }} />
          <Txt v="medium">:</Txt>
          <Field placeholder={t.minute} value={minute} onChangeText={num(setMinute, 2)} keyboardType="number-pad" style={{ textAlign: 'center' }} />
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <Field
          label={t.place}
          placeholder={t.placePh}
          value={placeText}
          onChangeText={onPlaceChange}
          autoCorrect={false}
        />
        {searching ? <Txt v="small">{t.searching}</Txt> : null}
        {results.length > 0 && !place ? (
          <View style={{ borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, overflow: 'hidden' }}>
            {results.map((p, i) => (
              <Pressable
                key={`${p.latitude},${p.longitude},${i}`}
                onPress={() => { setPlace(p); setPlaceText(label(p, lang)); setResults([]); }}
                style={({ pressed }) => ({ paddingVertical: 13, paddingHorizontal: 14, borderTopWidth: i ? 1 : 0, borderColor: C.line, backgroundColor: pressed ? C.paper2 : 'transparent' })}
              >
                <Txt>{label(p, lang)}</Txt>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
      {err ? <Txt color={C.red}>{err}</Txt> : null}
      <Button title={other ? t.saveOther : t.save} onPress={submit} />
      <Txt v="small" center>{t.privacy}</Txt>
    </View>
  );
}

function label(p: Place, lang: string) {
  return [p.name, p.admin1, p.country].filter(Boolean).join(lang === 'ar' ? '، ' : ', ');
}
