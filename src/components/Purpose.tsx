import React from 'react';
import { Pressable, View } from 'react-native';
import DRAW from '../content/draw.json';
import { DIGESTION, ENVIRONMENT, MOTIVATION, PERSPECTIVE, PURPOSE_UI, RAX_THEME_AR, SENSE } from '../content/purpose';
import { crossAngle, variables, type Chart } from '../engine/hd';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { useLabels } from './ChartView';
import { Card, Section, Txt, useDir } from './ui';

const RAXG = DRAW.RAXG as Record<string, string>;
const LAXG = DRAW.LAXG as Record<string, string>;

export type ChartTab = 'design' | 'theme' | 'work';

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  const { row } = useDir();
  return (
    <View style={{ flexDirection: row, backgroundColor: C.paper2, borderRadius: 999, padding: 4, marginTop: 24 }}>
      {options.map(([k, label]) => (
        <Pressable
          key={k}
          onPress={() => onChange(k)}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === k }}
          style={{ flex: 1, minHeight: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, backgroundColor: value === k ? C.esp : 'transparent' }}
        >
          <Txt v="medium" center color={value === k ? C.cream : C.ink} style={{ fontSize: 13, lineHeight: 18 }}>{label}</Txt>
        </Pressable>
      ))}
    </View>
  );
}

export function useChartTabs(): [ChartTab, string][] {
  const { lang } = useApp();
  const u = PURPOSE_UI[lang];
  return [['design', u.tabDesign], ['theme', u.tabTheme], ['work', u.tabWork]];
}

export function LifeTheme({ chart }: { chart: Chart }) {
  const { lang, c } = useApp();
  const u = PURPOSE_UI[lang];
  const L = useLabels();
  const angle = crossAngle(chart);
  const g = chart.cross[0];
  const cr = c.cross as { raxName: Record<string, string>; laxName: Record<string, string>; raxTheme: Record<string, string>; laxTheme: Record<string, string>; jxName: Record<string, string> };
  let name = '', theme = '';
  if (angle === 'jux') {
    name = u.angle.jux.name(cr.jxName[String(g)] ?? '');
    theme = L.gate(g)?.text ?? '';
  } else if (angle === 'left') {
    const k = LAXG[String(g)];
    name = u.angle.left.name(cr.laxName[k] ?? k);
    theme = cr.laxTheme[k] ?? '';
  } else {
    const k = RAXG[String(g)];
    name = u.angle.right.name(cr.raxName[k] ?? k);
    theme = lang === 'ar' ? RAX_THEME_AR[k] ?? cr.raxTheme[k] : cr.raxTheme[k];
  }
  const { row } = useDir();
  return (
    <View>
      <Section label={u.crossLabel} title={name}>
        <Txt v="small">{[u.angle[angle].tag, `\u2066${chart.cross[0]}/${chart.cross[1]} | ${chart.cross[2]}/${chart.cross[3]}\u2069`].filter(Boolean).join(' · ')}</Txt>
        {theme ? <Txt v="italic" style={{ fontSize: 21, lineHeight: lang === 'ar' ? 34 : 27 }}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Txt> : null}
        <Txt>{u.crossIntro}</Txt>
        <Card dark>
          <Txt color={C.cream}>{u.angle[angle].text}</Txt>
        </Card>
      </Section>
      <Section label={u.fourGates}>
        {chart.cross.map((gate, i) => {
          const x = L.gate(gate);
          return (
            <Card key={i}>
              <View style={{ flexDirection: row, alignItems: 'baseline', gap: 10 }}>
                <Txt v="title" style={{ fontSize: 26, lineHeight: 34 }} color={i < 2 ? C.ink : C.red}>{String(gate)}</Txt>
                <Txt v="medium" style={{ flex: 1 }}>{x?.name}</Txt>
              </View>
              <Txt v="small">{`${u.roles[i][0]} · ${u.roles[i][1]}`}</Txt>
              <Txt>{x?.text}</Txt>
            </Card>
          );
        })}
      </Section>
    </View>
  );
}

export function WorkBest({ chart }: { chart: Chart }) {
  const { lang } = useApp();
  const u = PURPOSE_UI[lang];
  const v = variables(chart);
  const pair = (name: string, side: string) => (lang === 'ar' ? `${name} · ${side}` : `${side} ${name}`);
  const dig = DIGESTION[lang][v.digestion.color];
  const env = ENVIRONMENT[lang][v.environment.color];
  const sense = SENSE[lang][v.sense.tone];
  const per = PERSPECTIVE[lang][v.perspective.color];
  const mot = MOTIVATION[lang][v.motivation.color];
  const items: { label: string; sub: string; title: string; body: string[] }[] = [
    { label: u.digestion, sub: u.digestionSub, title: pair(dig.name, dig.sides![v.digestion.side].name), body: [dig.text, dig.sides![v.digestion.side].text] },
    { label: u.sense, sub: u.senseSub, title: sense.name, body: [sense.text] },
    { label: u.environment, sub: u.environmentSub, title: pair(env.name, env.sides![v.environment.side].name), body: [env.text, env.sides![v.environment.side].text] },
    { label: u.perspective, sub: u.perspectiveSub, title: per.name, body: [per.text] },
    { label: u.motivation, sub: u.motivationSub, title: mot.name, body: [mot.text] },
  ];
  return (
    <View>
      <Section>
        <Txt>{u.workIntro}</Txt>
        <Txt v="small">{u.workNote}</Txt>
      </Section>
      <View style={{ gap: 12, marginTop: 20 }}>
        {items.map((it) => (
          <Card key={it.label}>
            <Txt v="label">{it.label}</Txt>
            <Txt v="small">{it.sub}</Txt>
            <Txt v="title" style={{ fontSize: 26, lineHeight: lang === 'ar' ? 40 : 32 }}>{it.title}</Txt>
            {it.body.map((b, i) => <Txt key={i}>{b}</Txt>)}
          </Card>
        ))}
      </View>
    </View>
  );
}
