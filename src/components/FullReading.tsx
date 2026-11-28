// The paid "full reading": unlocked by My Chart (one-time), Silver or Gold.
// A guided, chapter-by-chapter reading of one person's design.
import React from 'react';
import { View } from 'react-native';
import { CHANNELS_DEEP } from '../content/channels-deep';
import { DEEP_UI, LINES_DEEP } from '../content/deep';
import { GATES_DEEP } from '../content/gates-deep';
import { CENTRES, type Chart } from '../engine/hd';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { useLabels } from './ChartView';
import { Lock } from './Lock';
import { Card, Section, Txt, useDir } from './ui';

const CIRCUIT_AR: Record<string, string> = { Individual: 'الفردية', Ego: 'الإيغو', Defense: 'الحماية', Abstract: 'التجريد', Logic: 'المنطق', Integration: 'الاندماج' };

function Para({ h, body, italic }: { h?: string; body?: string; italic?: boolean }) {
  if (!body) return null;
  return (
    <View style={{ gap: 4, marginTop: 10 }}>
      {h ? <Txt v="label" color={C.red}>{h}</Txt> : null}
      <Txt v={italic ? 'italic' : undefined}>{body}</Txt>
    </View>
  );
}

export function FullReading({ chart, unlocked, lockedText, ctaPrice }: { chart: Chart; unlocked: boolean; lockedText?: string; ctaPrice?: string }) {
  const { t, c, lang } = useApp();
  const L = useLabels();
  const D = DEEP_UI[lang];
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
  const planets = c.planets as Record<string, { name: string; text: string }>;
  const lines = c.lines as Record<string, { name: string; text: string }>;
  const defs = c.definitions as Record<string, string>;
  const circuitOf = c.circuitOf as Record<string, string>;
  const [p1, p2] = chart.profile.split('/');
  const LD = LINES_DEEP[lang];

  return (
    <View>
      {/* 1. Energy type */}
      <Section label={D.chapterType} title={L.type(chart.type).name}>
        <Txt>{ty.summary}</Txt>
        <Para h={t.aura} body={ty.aura} />
        <Para h={t.inRealLife} body={ty.strat} />
        <Para h={t.signals} body={ty.signs} />
        <Para h={t.workMoney} body={ty.work} />
        <Para h={t.loveRel} body={ty.love} />
        <Para h={t.restH} body={ty.rest} />
        <Card dark style={{ marginTop: 14 }}>
          <Txt v="label" color={C.redDark}>{t.experiment}</Txt>
          <Txt color={C.cream}>{ty.experiment}</Txt>
        </Card>
      </Section>

      {/* 2. Authority */}
      <Section label={D.chapterAuth} title={L.auth(chart.authority)}>
        <Txt>{au.summary}</Txt>
        {au.feel !== au.summary ? <Para body={au.feel} /> : null}
        <Para h={t.authReal} body={au.scene} />
        <Para h={t.authTrap} body={au.trap} />
        <Para h={t.authPractice} body={au.practice} />
      </Section>

      {/* 3. Profile */}
      <Section label={D.chapterProfile} title={chart.profile}>
        <Txt>{(c.profiles as Record<string, string>)[chart.profile]}</Txt>
        {([[p1, D.conscious, 'conscious'], [p2, D.unconscious, 'unconscious']] as const).map(([n, label, side]) => (
          <Card key={side} style={{ marginTop: 12 }}>
            <Txt v="label" color={side === 'conscious' ? C.ink : C.red}>{`${label} · ${t.line} ${n} · ${lines[n]?.name}`}</Txt>
            <Txt v="italic">{LD[n]?.core}</Txt>
            <Txt>{LD[n]?.[side]}</Txt>
            <Para h={D.gift} body={LD[n]?.gift} />
            <Para h={D.challenge} body={LD[n]?.challenge} />
          </Card>
        ))}
      </Section>

      {/* 4. Definition */}
      <Section label={D.chapterDef} title={L.def(chart.definition)}>
        <Txt>{defs[chart.definition]}</Txt>
      </Section>

      {/* 5. Centres, personal */}
      <Section label={D.chapterCentres}>
        {CENTRES.map((k) => {
          const x = c.centres[k];
          const def = !!chart.defined[k];
          return (
            <Card key={k}>
              <View style={{ flexDirection: row, alignItems: 'center', gap: 10 }}>
                <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: def ? C.red : 'transparent', borderWidth: 1.5, borderColor: def ? C.red : C.muted }} />
                <Txt v="medium" style={{ flex: 1 }}>{L.centre(k)}</Txt>
                <Txt v="small">{def ? t.defined : t.open}</Txt>
              </View>
              <Txt v="small">{x.does}</Txt>
              <Para h={def ? D.yourDefined : D.yourOpen} body={def ? x.defined : x.open} />
              {!def ? <Para h={D.trapL} body={x.trap} /> : null}
              {!def ? <Para h={D.wiseL} body={x.wisdom} /> : null}
              {!def ? <Para h={D.askL} body={x.question} italic /> : null}
            </Card>
          );
        })}
      </Section>

      {/* 6. Channels */}
      <Section label={D.chapterChannels}>
        <Txt v="small">{chart.channels.length ? D.channelsLead : D.noChannels}</Txt>
        {chart.channels.map((ch) => {
          const lc = L.channel(ch.key);
          const circ = circuitOf[ch.key];
          return (
            <Card key={ch.key}>
              <View style={{ flexDirection: row, alignItems: 'baseline', gap: 10 }}>
                <Txt v="medium" style={{ flex: 1 }}>{lc.name}</Txt>
                <Txt v="medium" color={C.red}>{ch.key}</Txt>
              </View>
              <Txt v="small">{`${L.centre(ch.from)} ↔ ${L.centre(ch.to)}${circ ? ' · ' + D.circuit(lang === 'ar' ? CIRCUIT_AR[circ] ?? circ : circ) : ''}`}</Txt>
              <Txt>{lc.text}</Txt>
              <Para body={CHANNELS_DEEP[lang][ch.key]?.life} />
              <Para h={D.gift} body={CHANNELS_DEEP[lang][ch.key]?.gift} />
              <Para h={D.trapL} body={CHANNELS_DEEP[lang][ch.key]?.watch} />
              {[ch.a, ch.b].map((g) => (
                <Txt key={g} v="small">{`${t.gate} ${g} · ${L.gate(g)?.name}: ${L.gate(g)?.text}`}</Txt>
              ))}
            </Card>
          );
        })}
      </Section>

      {/* 7. Gates, one by one */}
      <Section label={D.chapterGates}>
        <Txt v="small">{D.gatesLead}</Txt>
        {([['personality', C.ink, D.personalityL], ['design', C.red, D.designL]] as const).map(([side, color, label]) => (
          <View key={side} style={{ gap: 10, marginTop: 10 }}>
            <Txt v="label" color={color}>{label}</Txt>
            {chart[side].map((a) => {
              const g = L.gate(a.gate);
              return (
                <Card key={side + a.planet}>
                  <View style={{ flexDirection: row, alignItems: 'baseline', gap: 10 }}>
                    <Txt v="medium" style={{ flex: 1 }}>{`${planets[a.planet]?.name ?? a.planet} · ${g?.name}`}</Txt>
                    <Txt v="medium" color={color}>{`${a.gate}.${a.line}`}</Txt>
                  </View>
                  <Txt v="small">{planets[a.planet]?.text}</Txt>
                  <Txt>{g?.text}</Txt>
                  <Para h={D.gift} body={GATES_DEEP[lang][String(a.gate)]?.gift} />
                  <Para h={D.challenge} body={GATES_DEEP[lang][String(a.gate)]?.shadow} />
                  <Txt v="small">{`${t.line} ${a.line}, ${lines[String(a.line)]?.name}: ${lines[String(a.line)]?.text}`}</Txt>
                </Card>
              );
            })}
          </View>
        ))}
      </Section>
    </View>
  );
}
