import React, { useMemo } from 'react';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { IconGear } from '../../components/icons';
import { useLabels } from '../../components/ChartView';
import { Lock } from '../../components/Lock';
import { TypeSeal } from '../../components/TypeSeal';
import { Card, Section, Screen, Txt, useDir } from '../../components/ui';
import { DAILY } from '../../content/extra';
import { GATE_CENTRE, hangingGates, transits } from '../../engine/hd';
import { useApp } from '../../state/AppState';
import { C } from '../../theme';

const dayOfYear = (d: Date) => Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);

export default function Today() {
  const { me, t, lang, chartOf, can } = useApp();
  const L = useLabels();
  const { row: rowDir } = useDir();
  const now = useMemo(() => new Date(), []);
  const chart = me ? chartOf(me) : null;
  const sky = useMemo(() => transits(now), [now]);
  if (!me || !chart) return null;

  const hour = now.getHours();
  const hello = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening;
  const tips = DAILY[lang][chart.type];
  const tip = tips[dayOfYear(now) % tips.length];
  const sun = sky.find((a) => a.planet === 'Sun')!;
  const moon = sky.find((a) => a.planet === 'Moon')!;
  const sunGate = L.gate(sun.gate);
  const moonGate = L.gate(moon.gate);
  const centre = GATE_CENTRE[sun.gate];
  const completes = hangingGates(chart).filter((h) => h.other === sun.gate);
  const dateStr = now.toLocaleDateString(lang === 'ar' ? 'ar-LB' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen>
      <View style={{ flexDirection: rowDir, alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt v="small">{dateStr}</Txt>
        <Pressable onPress={() => router.push('/settings')} hitSlop={12} accessibilityRole="button" accessibilityLabel={t.settingsA11y} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
          <IconGear color={C.ink} />
        </Pressable>
      </View>
      <Txt v="display" style={{ marginTop: 6 }}>{hello}{lang === 'ar' ? '،' : ','}</Txt>
      <Txt v="hand" style={{ marginTop: 2 }}>{me.name}</Txt>

      <Section label={t.todayFor}>
        {can.dailyTips ? (
          <Card dark style={{ paddingVertical: 28 }}>
            <View style={{ flexDirection: rowDir, alignItems: 'center', gap: 10 }}>
              <TypeSeal type={chart.type} size={34} />
              <Txt v="label" color={C.redDark}>{L.type(chart.type).name}</Txt>
            </View>
            <Txt v="italic" color={C.cream} style={{ fontSize: 25, lineHeight: lang === 'ar' ? 40 : 31 }}>{tip}</Txt>
          </Card>
        ) : (
          <Lock text={t.tipsLocked} cta={t.managePlan} />
        )}
      </Section>

      <Section label={t.skyTitle} title={t.sunIn(sun.gate, sunGate.name)}>
        <Txt>{sunGate.text}</Txt>
        <Txt v="small">{t.everyone}</Txt>
        <Card style={{ marginTop: 6 }}>
          <View style={{ gap: 10 }}>
            {chart.gates.includes(sun.gate) ? <Txt>{t.youCarry}</Txt> : null}
            {completes.map((h) => (
              <Txt key={h.key}>{t.completes(L.channel(h.key).name)}</Txt>
            ))}
            <Txt>{chart.defined[centre] ? t.definedCentre(L.centre(centre)) : t.openCentre(L.centre(centre))}</Txt>
          </View>
        </Card>
        <Txt v="small" style={{ marginTop: 8 }}>{t.moonIn(moon.gate, moonGate.name)}</Txt>
      </Section>
    </Screen>
  );
}
