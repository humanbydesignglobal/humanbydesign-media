import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { TypeSeal } from '../../components/TypeSeal';
import { Card, Field, Screen, Section, Txt, useDir } from '../../components/ui';
import { buildLibrary, type Entry, type Kind } from '../../content/library';
import { LESSONS } from '../../content/lessons';
import type { TypeId } from '../../engine/hd';
import { useApp } from '../../state/AppState';
import { C } from '../../theme';

const open = (e: Pick<Entry, 'kind' | 'id'>) => router.push({ pathname: '/learn/[kind]/[id]', params: { kind: e.kind, id: e.id } });

export default function Learn() {
  const { t, lang, c, learned } = useApp();
  const { row } = useDir();
  const [q, setQ] = useState('');
  const lib = useMemo(() => buildLibrary(lang, c), [lang, c]);
  const query = q.trim().toLowerCase();
  const results = useMemo(
    () => (query.length < 2 ? [] : (Object.values(lib).flat() as Entry[]).filter((e) => e.search.includes(query)).slice(0, 40)),
    [lib, query]
  );
  const lessons = LESSONS[lang];
  const doneCount = lessons.filter((l) => learned.includes(l.id)).length;

  const sections: [Kind, string][] = [
    ['authority', t.libAuth], ['centre', t.libCentres], ['profile', t.libProfiles], ['channel', t.libChannels], ['gate', t.libGates],
  ];

  return (
    <Screen>
      <Txt v="display">{t.learnTitle}</Txt>
      <Txt v="small" style={{ marginTop: 8 }}>{t.learnLead}</Txt>
      <View style={{ marginTop: 18 }}>
        <Field placeholder={t.searchPh} value={q} onChangeText={setQ} autoCorrect={false} accessibilityLabel={t.searchPh} />
      </View>

      {query.length >= 2 ? (
        <View style={{ marginTop: 18, gap: 8 }}>
          {results.length === 0 ? <Txt>{t.noResults}</Txt> : null}
          {results.map((e) => (
            <Row key={e.kind + e.id} e={e} />
          ))}
        </View>
      ) : (
        <>
          <Section label={t.startHere} title={`${doneCount}/${lessons.length}`}>
            <View style={{ height: 6, borderRadius: 3, backgroundColor: C.paper2, overflow: 'hidden' }}>
              <View style={{ height: 6, width: `${(doneCount / lessons.length) * 100}%`, backgroundColor: C.red }} />
            </View>
            {lessons.map((l, i) => {
              const done = learned.includes(l.id);
              return (
                <Card key={l.id} onPress={() => open({ kind: 'lesson', id: l.id })}>
                  <View style={{ flexDirection: row, alignItems: 'center', gap: 14 }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? C.red : C.paper2 }}>
                      <Txt v="medium" center color={done ? C.white : C.ink} style={{ fontSize: 14 }}>{done ? '✓' : String(i + 1)}</Txt>
                    </View>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Txt v="medium">{l.title}</Txt>
                      <Txt v="small">{`${t.minRead(l.minutes)} · ${l.note}`}</Txt>
                    </View>
                  </View>
                </Card>
              );
            })}
          </Section>

          <Section label={t.library} title={t.libTypes}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4, flexDirection: row }}>
              {lib.type.map((e) => (
                <Pressable key={e.id} onPress={() => open(e)} style={({ pressed }) => ({ width: 150, padding: 16, borderRadius: 18, backgroundColor: C.esp, gap: 8, opacity: pressed ? 0.85 : 1 })}>
                  <TypeSeal type={e.id as TypeId} size={64} />
                  <Txt v="title" color={C.cream} style={{ fontSize: 22, lineHeight: lang === 'ar' ? 34 : 26 }}>{e.title}</Txt>
                  <Txt v="small" color={C.mutedDark}>{e.sub}</Txt>
                </Pressable>
              ))}
            </ScrollView>
          </Section>

          {sections.map(([kind, label]) => (
            <LibSection key={kind} label={label} items={lib[kind]} />
          ))}
        </>
      )}
    </Screen>
  );
}

function LibSection({ label, items }: { label: string; items: Entry[] }) {
  const [all, setAll] = useState(false);
  const { lang } = useApp();
  const shown = all ? items : items.slice(0, 5);
  return (
    <Section title={label}>
      <View style={{ gap: 0 }}>
        {shown.map((e) => <Row key={e.id} e={e} />)}
      </View>
      {items.length > 5 ? (
        <Pressable onPress={() => setAll(!all)} style={{ paddingVertical: 10 }}>
          <Txt v="medium" color={C.red}>{all ? (lang === 'ar' ? 'أقل' : 'Show less') : (lang === 'ar' ? `شوف الكل (${items.length})` : `See all ${items.length}`)}</Txt>
        </Pressable>
      ) : null}
    </Section>
  );
}

function Row({ e }: { e: Entry }) {
  const { row, rtl } = useDir();
  return (
    <Pressable onPress={() => open(e)} style={({ pressed }) => ({ paddingVertical: 13, borderBottomWidth: 1, borderColor: C.line, flexDirection: row, alignItems: 'center', gap: 12, opacity: pressed ? 0.7 : 1 })}>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt v="medium">{e.title}</Txt>
        {e.sub ? <Txt v="small" numberOfLines={2}>{e.sub}</Txt> : null}
      </View>
      <Txt v="medium" color={C.muted}>{rtl ? '‹' : '›'}</Txt>
    </Pressable>
  );
}
