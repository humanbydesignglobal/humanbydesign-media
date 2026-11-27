import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { BackLink } from '../../components/BackLink';
import { ChartBody, ChartHeader, GateList, useLabels } from '../../components/ChartView';
import { FullReading } from '../../components/FullReading';
import { LifeTheme, Segmented, WorkBest, useChartTabs, type ChartTab } from '../../components/Purpose';
import { Button, Card, Section, Screen, Txt, useDir } from '../../components/ui';
import { CONNECTION_TEXT, WITH_TYPE } from '../../content/extra';
import { connection, type ConnectionKind } from '../../engine/hd';
import { useApp } from '../../state/AppState';
import { C } from '../../theme';

const ORDER: ConnectionKind[] = ['spark', 'shared', 'teach', 'bend'];

export default function Person() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { people, me, t, lang, chartOf, removePerson, can } = useApp();
  const L = useLabels();
  const { row } = useDir();
  const [confirm, setConfirm] = useState(false);
  const [tab, setTab] = useState<'design' | 'together'>('design');
  const [sub, setSub] = useState<ChartTab>('design');
  const chartTabs = useChartTabs();
  const p = people.find((x) => x.id === id);
  const chart = p ? chartOf(p) : null;
  const mine = me ? chartOf(me) : null;
  const conn = chart && mine ? connection(mine, chart) : null;
  if (!p || !chart) return <Screen><BackLink /></Screen>;

  return (
    <Screen>
      <BackLink />
      <View style={{ marginTop: 10 }}>
        <ChartHeader chart={chart} name={p.name} other />
      </View>

      <View style={{ flexDirection: row, marginTop: 24, backgroundColor: C.paper2, borderRadius: 999, padding: 4 }}>
        {(['design', 'together'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setTab(k)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === k }}
            style={{ flex: 1, minHeight: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === k ? C.esp : 'transparent' }}
          >
            <Txt v="medium" center color={tab === k ? C.cream : C.ink} style={{ fontSize: 14 }}>
              {k === 'design' ? t.theirDesign(p.name) : t.youTwo}
            </Txt>
          </Pressable>
        ))}
      </View>

      {tab === 'together' ? (
        <View>
          {conn ? (
        <Section label={t.together} title={t.togetherType(L.type(conn.together.type).name)}>
          <Card dark>
            <Txt v="hand" color={C.redDark}>{t.beingWith(p.name)}</Txt>
            <Txt color={C.cream}>{WITH_TYPE[lang][chart.type]}</Txt>
          </Card>
          <Txt v="label" style={{ marginTop: 18 }}>{t.howMeet}</Txt>
          {conn.channels.length === 0 ? <Txt>{t.noLinks}</Txt> : null}
          {ORDER.map((kind) => {
            const list = conn.channels.filter((c) => c.kind === kind);
            if (!list.length) return null;
            const info = CONNECTION_TEXT[lang][kind];
            return (
              <Card key={kind}>
                <Txt v="title" style={{ fontSize: 24, lineHeight: 34 }}>{info.title}</Txt>
                <Txt v="small">{info.text}</Txt>
                <View style={{ gap: 8, marginTop: 6 }}>
                  {list.map((c) => {
                    const who = c.from === 'a' ? t.you : c.from === 'b' ? p.name : null;
                    return (
                      <View key={c.key} style={{ flexDirection: row, gap: 10, alignItems: 'baseline' }}>
                        <Txt v="medium" style={{ flex: 1 }}>{L.channel(c.key).name}</Txt>
                        <Txt v="small">{who ? `${who} · ${c.key}` : c.key}</Txt>
                      </View>
                    );
                  })}
                </View>
              </Card>
            );
          })}
        </Section>
      ) : null}

        </View>
      ) : (
        <View>
          <Segmented value={sub} options={chartTabs} onChange={setSub} />
          {sub === 'design' ? (
            <>
              <ChartBody chart={chart} />
              <FullReading chart={chart} unlocked={can.peopleFullReading} lockedText={t.peopleReadingLocked(p.name)} />
              <GateList chart={chart} />
            </>
          ) : sub === 'theme' ? (
            <LifeTheme chart={chart} />
          ) : (
            <WorkBest chart={chart} />
          )}
        </View>
      )}
      <View style={{ marginTop: 40, gap: 10 }}>
        {confirm ? (
          <>
            <Txt center>{t.removeAsk(p.name)}</Txt>
            <Button title={t.remove} onPress={() => { removePerson(p.id); router.back(); }} />
            <Button kind="ghost" title={t.cancel} onPress={() => setConfirm(false)} />
          </>
        ) : (
          <Button kind="ghost" title={t.remove} onPress={() => setConfirm(true)} />
        )}
      </View>
    </Screen>
  );
}
