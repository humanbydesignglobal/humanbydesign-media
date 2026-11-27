import React, { useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { AUTH_LABELS, CENTRE_LABELS, CHANNEL_AR, DEF_LABELS, TYPE_LABELS } from '../content/extra';
import { CENTRES, type Chart, type CentreId } from '../engine/hd';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { Bodygraph } from './Bodygraph';
import { Card, Pill, Section, Txt, useDir } from './ui';

export function useLabels() {
  const { lang, c } = useApp();
  return {
    type: (t: Chart['type']) => TYPE_LABELS[lang][t],
    auth: (a: Chart['authority']) => AUTH_LABELS[lang][a],
    centre: (k: CentreId) => CENTRE_LABELS[lang][k],
    def: (d: string) => DEF_LABELS[lang][d] ?? d,
    channel: (key: string) => ({
      name: (c.channels as Record<string, { name: string; text: string }>)[key]?.name ?? key,
      text: lang === 'ar' ? CHANNEL_AR[key] ?? '' : (c.channels as Record<string, { text: string }>)[key]?.text ?? '',
    }),
    gate: (g: number) => (c.gates as Record<string, { name: string; text: string }>)[String(g)],
  };
}

export function ChartHeader({ chart, name, other }: { chart: Chart; name?: string; other?: boolean }) {
  const { t, c } = useApp();
  const L = useLabels();
  const { row } = useDir();
  const T = L.type(chart.type);
  return (
    <View style={{ gap: 14 }}>
      {name ? <Txt v="hand">{name}</Txt> : null}
      <Txt v="label">{other && name ? t.theyAre(name) : t.youAre}</Txt>
      <Txt v="display">{T.name}</Txt>
      <Txt v="italic" color={C.muted}>{T.gift}</Txt>
      <View style={{ flexDirection: row, flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
        <Pill text={chart.profile} red />
        <Pill text={L.auth(chart.authority)} />
        <Pill text={L.def(chart.definition)} />
      </View>
      <Txt style={{ marginTop: 6 }}>{c.types[chart.type].summary}</Txt>
    </View>
  );
}

export function ChartBody({ chart }: { chart: Chart }) {
  const { t, c } = useApp();
  const L = useLabels();
  const { row } = useDir();
  const { width } = useWindowDimensions();
  const T = L.type(chart.type);
  const profile = (c.profiles as Record<string, string>)[chart.profile];
  const [openCentre, setOpenCentre] = useState<CentreId | null>(null);

  return (
    <View>
      <View style={{ alignItems: 'center', marginTop: 28 }}>
        <Bodygraph chart={chart} width={Math.min(width - 48, 340)} />
        <View style={{ flexDirection: row, gap: 16, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Legend color={C.red} text={t.legendDes} />
          <Legend color={C.ink} text={t.legendPer} />
        </View>
      </View>

      <Section label={t.strategy} title={T.strategy}>
        <View style={{ flexDirection: row, gap: 10 }}>
          <Card style={{ flex: 1 }}>
            <Txt v="small">{t.signature}</Txt>
            <Txt v="medium">{T.signature}</Txt>
          </Card>
          <Card style={{ flex: 1 }}>
            <Txt v="small">{t.notSelf}</Txt>
            <Txt v="medium">{T.notSelf}</Txt>
          </Card>
        </View>
        <Card dark>
          <Txt v="hand" color={C.redDark}>{t.experiment}</Txt>
          <Txt color={C.cream}>{c.types[chart.type].experiment}</Txt>
        </Card>
      </Section>

      <Section label={t.authority} title={L.auth(chart.authority)}>
        <Txt>{c.authorities[chart.authority].summary}</Txt>
      </Section>

      <Section label={t.profile} title={chart.profile}>
        {profile ? <Txt>{profile}</Txt> : null}
      </Section>

      <Section label={t.definition} title={L.def(chart.definition)}>
        <Txt>{(c.definitions as Record<string, string>)[chart.definition]}</Txt>
      </Section>

      <Section label={t.centres}>
        <Txt v="small">{t.centresLead}</Txt>
        {CENTRES.map((k) => {
          const isDef = !!chart.defined[k];
          const x = c.centres[k];
          const open = openCentre === k;
          return (
            <Card key={k} onPress={() => setOpenCentre(open ? null : k)}>
              <View style={{ flexDirection: row, alignItems: 'center', gap: 12 }}>
                <View style={{ width: 14, height: 14, borderRadius: 3, borderWidth: 1.5, borderColor: C.ink, backgroundColor: isDef ? C.red : C.white }} />
                <Txt v="medium" style={{ flex: 1 }}>{L.centre(k)}</Txt>
                <Txt v="small">{isDef ? t.defined : t.open}</Txt>
              </View>
              <Txt v="small">{x.does}</Txt>
              {open ? (
                <View style={{ gap: 10, marginTop: 4 }}>
                  <Txt>{isDef ? x.defined : x.open}</Txt>
                  <Txt v="label">{t.ask}</Txt>
                  <Txt v="italic" style={{ fontSize: 20, lineHeight: 30 }}>{x.question}</Txt>
                </View>
              ) : null}
            </Card>
          );
        })}
      </Section>

      <Section label={t.channels}>
        {chart.channels.length ? <Txt v="small">{t.channelsLead}</Txt> : <Txt>{t.noChannels}</Txt>}
        {chart.channels.map((ch) => {
          const x = L.channel(ch.key);
          return (
            <Card key={ch.key}>
              <View style={{ flexDirection: row, alignItems: 'baseline', gap: 10 }}>
                <Txt v="title" style={{ fontSize: 24, lineHeight: 34, flex: 1 }}>{x.name}</Txt>
                <Txt v="small">{ch.key}</Txt>
              </View>
              <Txt>{x.text}</Txt>
            </Card>
          );
        })}
      </Section>
    </View>
  );
}

function Legend({ color, text }: { color: string; text: string }) {
  const { row } = useDir();
  return (
    <View style={{ flexDirection: row, alignItems: 'center', gap: 6 }}>
      <View style={{ width: 18, height: 5, borderRadius: 3, backgroundColor: color }} />
      <Txt v="small" style={{ fontSize: 12 }}>{text}</Txt>
    </View>
  );
}

export function GateList({ chart }: { chart: Chart }) {
  const { t } = useApp();
  const L = useLabels();
  const { row } = useDir();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section label={t.gates}>
      {chart.gates.map((g) => {
        const x = L.gate(g);
        const isOpen = open === g;
        return (
          <Pressable key={g} onPress={() => setOpen(isOpen ? null : g)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: C.line, gap: 6 }}>
            <View style={{ flexDirection: row, gap: 12, alignItems: 'baseline' }}>
              <Txt v="medium" style={{ width: 34 }}>{g}</Txt>
              <Txt style={{ flex: 1 }}>{x?.name}</Txt>
            </View>
            {isOpen ? <Txt v="small">{x?.text}</Txt> : null}
          </Pressable>
        );
      })}
    </Section>
  );
}
