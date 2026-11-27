// The paid "full reading": unlocked by My Chart (one-time), Silver or Gold.
import React from 'react';
import { View } from 'react-native';
import { CENTRES, type Chart } from '../engine/hd';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { useLabels } from './ChartView';
import { Lock } from './Lock';
import { Card, Section, Txt, useDir } from './ui';

export function FullReading({ chart, unlocked, lockedText, ctaPrice }: { chart: Chart; unlocked: boolean; lockedText?: string; ctaPrice?: string }) {
  const { t, c } = useApp();
  const L = useLabels();
  const { row } = useDir();

  if (!unlocked) {
    return (
      <Section label={t.fullReading}>
        <Lock title={t.fullReading} text={lockedText ?? t.fullReadingLead} cta={ctaPrice ? `${t.unlock} · ${ctaPrice}` : t.unlock} />
      </Section>
    );
  }

  const ty = c.types[chart.type];
  const au = c.authorities[chart.authority];
  const blocks: [string, string][] = [
    [t.inRealLife, ty.strat], [t.signals, ty.signs], [t.workMoney, ty.work], [t.loveRel, ty.love], [t.restH, ty.rest],
  ];
  const auth: [string, string][] = [[t.authReal, au.scene], [t.authTrap, au.trap], [t.authPractice, au.practice]];
  const planets = c.planets as Record<string, { name: string; text: string }>;
  const lines = c.lines as Record<string, { name: string; text: string }>;

  return (
    <View>
      <Section label={t.fullReading} title={L.type(chart.type).name}>
        <Txt>{ty.aura}</Txt>
        {blocks.map(([h, body]) => (body ? (
          <View key={h} style={{ gap: 6, marginTop: 10 }}>
            <Txt v="italic">{h}</Txt>
            <Txt>{body}</Txt>
          </View>
        ) : null))}
      </Section>

      <Section label={t.authority} title={L.auth(chart.authority)}>
        {auth.map(([h, body]) => (body ? (
          <View key={h} style={{ gap: 6, marginTop: 6 }}>
            <Txt v="italic">{h}</Txt>
            <Txt>{body}</Txt>
          </View>
        ) : null))}
      </Section>

      <Section label={t.centres}>
        {CENTRES.map((k) => {
          const x = c.centres[k];
          return (
            <Card key={k}>
              <Txt v="medium">{`${L.centre(k)} · ${chart.defined[k] ? t.defined : t.open}`}</Txt>
              <Txt v="small">{t.cenTrap}</Txt>
              <Txt>{x.trap}</Txt>
              <Txt v="small">{t.cenWisdom}</Txt>
              <Txt>{x.wisdom}</Txt>
            </Card>
          );
        })}
      </Section>

      <Section label={t.activations}>
        <Txt v="small">{t.activationsLead}</Txt>
        {([['personality', C.ink], ['design', C.red]] as const).map(([side, color]) => (
          <View key={side} style={{ gap: 10, marginTop: 8 }}>
            <Txt v="label" color={color}>{side === 'personality' ? t.personality : t.design}</Txt>
            {chart[side].map((a) => {
              const g = L.gate(a.gate);
              return (
                <Card key={side + a.planet}>
                  <View style={{ flexDirection: row, alignItems: 'baseline', gap: 10 }}>
                    <Txt v="medium" style={{ flex: 1 }}>{planets[a.planet]?.name ?? a.planet}</Txt>
                    <Txt v="medium" color={color}>{`${a.gate}.${a.line}`}</Txt>
                  </View>
                  <Txt v="small">{`${g?.name} · ${t.line} ${a.line}, ${lines[String(a.line)]?.name}`}</Txt>
                  <Txt>{g?.text}</Txt>
                  <Txt v="small">{planets[a.planet]?.text}</Txt>
                </Card>
              );
            })}
          </View>
        ))}
      </Section>
    </View>
  );
}
