import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { BackLink } from '../../../components/BackLink';
import { useLabels } from '../../../components/ChartView';
import { Listen } from '../../../components/Listen';
import { TypeSeal } from '../../../components/TypeSeal';
import { Button, Card, Pill, Screen, Section, Txt, useDir } from '../../../components/ui';
import { CHANNELS_DEEP } from '../../../content/channels-deep';
import { DEEP_UI } from '../../../content/deep';
import { CENTRE_LABELS, TYPE_LABELS, WITH_TYPE } from '../../../content/extra';
import { GATES_DEEP } from '../../../content/gates-deep';
import { LESSONS } from '../../../content/lessons';
import type { Kind } from '../../../content/library';
import { GATE_CENTRE, partnerGates, type AuthorityId, type CentreId, type TypeId } from '../../../engine/hd';
import { useApp } from '../../../state/AppState';
import { C } from '../../../theme';

const go = (kind: Kind, id: string) => router.push({ pathname: '/learn/[kind]/[id]', params: { kind, id } });

export default function LearnEntry() {
  const { kind, id } = useLocalSearchParams<{ kind: Kind; id: string }>();
  return (
    <Screen>
      <BackLink />
      <View style={{ marginTop: 10 }}>
        {kind === 'lesson' ? <LessonView id={id} /> : null}
        {kind === 'type' ? <TypeView id={id as TypeId} /> : null}
        {kind === 'authority' ? <AuthView id={id as AuthorityId} /> : null}
        {kind === 'centre' ? <CentreView id={id as CentreId} /> : null}
        {kind === 'profile' ? <ProfileView id={id} /> : null}
        {kind === 'channel' ? <ChannelView id={id} /> : null}
        {kind === 'gate' ? <GateView id={Number(id)} /> : null}
      </View>
    </Screen>
  );
}

function YoursPill({ show }: { show: boolean }) {
  const { t } = useApp();
  return show ? <View style={{ flexDirection: 'row', marginTop: 4 }}><Pill text={t.yoursL} red /></View> : null;
}

function useMine() {
  const { me, chartOf } = useApp();
  return me ? chartOf(me) : null;
}

function LessonView({ id }: { id: string }) {
  const { t, lang, learned, markLearned } = useApp();
  const list = LESSONS[lang];
  const i = list.findIndex((l) => l.id === id);
  const l = list[i];
  if (!l) return null;
  const next = list[i + 1];
  return (
    <View style={{ gap: 14 }}>
      <Txt v="label">{`${t.startHere} · ${i + 1}/${list.length}`}</Txt>
      <Txt v="display" style={{ fontSize: 40, lineHeight: lang === 'ar' ? 60 : 42 }}>{l.title}</Txt>
      <Txt v="hand">{l.note}</Txt>
      <Listen voiceKey={`${lang}/lesson-${l.id}`} />
      {l.body.map((p, k) => <Txt key={k} style={{ fontSize: 17.5, lineHeight: lang === 'ar' ? 31 : 28 }}>{p}</Txt>)}
      <Card dark style={{ marginTop: 6 }}>
        <Txt v="hand" color={C.redDark}>{t.experiment}</Txt>
        <Txt color={C.cream}>{l.tryThis}</Txt>
      </Card>
      <View style={{ gap: 10, marginTop: 10 }}>
        {!learned.includes(l.id) ? <Button title={t.markDone} onPress={() => markLearned(l.id)} /> : null}
        {next ? (
          <Button
            kind={learned.includes(l.id) ? 'solid' : 'ghost'}
            title={`${t.nextLesson}: ${next.title}`}
            onPress={() => { markLearned(l.id); router.replace({ pathname: '/learn/[kind]/[id]', params: { kind: 'lesson', id: next.id } }); }}
          />
        ) : null}
      </View>
    </View>
  );
}

function TypeView({ id }: { id: TypeId }) {
  const { t, lang, c } = useApp();
  const mine = useMine();
  const T = TYPE_LABELS[lang][id];
  const x = c.types[id];
  const { row } = useDir();
  return (
    <View>
      <View style={{ flexDirection: row, alignItems: 'center', gap: 14 }}>
        <TypeSeal type={id} size={80} />
        <View style={{ flex: 1 }}>
          <Txt v="display" style={{ fontSize: 38, lineHeight: lang === 'ar' ? 56 : 40 }}>{T.name}</Txt>
          <Txt v="italic" color={C.muted}>{T.gift}</Txt>
        </View>
      </View>
      <YoursPill show={mine?.type === id} />
      <Txt style={{ marginTop: 16 }}>{x.summary}</Txt>
      <View style={{ flexDirection: row, gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: 140 }}><Txt v="small">{t.strategyL}</Txt><Txt v="medium">{T.strategy}</Txt></Card>
        <Card style={{ flex: 1, minWidth: 140 }}><Txt v="small">{t.signatureL}</Txt><Txt v="medium">{T.signature}</Txt></Card>
        <Card style={{ flex: 1, minWidth: 140 }}><Txt v="small">{t.notSelfL}</Txt><Txt v="medium">{T.notSelf}</Txt></Card>
      </View>
      <Section label={t.auraL}><Txt>{x.aura}</Txt></Section>
      <Section label={t.experiment}><Card dark><Txt color={C.cream}>{x.experiment}</Txt></Card></Section>
      <Section label={t.beingWithL(T.name)}><Txt>{WITH_TYPE[lang][id]}</Txt></Section>
    </View>
  );
}

function AuthView({ id }: { id: AuthorityId }) {
  const { c } = useApp();
  const L = useLabels();
  const mine = useMine();
  const a = c.authorities[id];
  return (
    <View style={{ gap: 14 }}>
      <Txt v="display" style={{ fontSize: 38 }}>{L.auth(id)}</Txt>
      <YoursPill show={mine?.authority === id} />
      <Txt>{a.summary}</Txt>
      {a.feel && a.feel !== a.summary ? <Txt>{a.feel}</Txt> : null}
    </View>
  );
}

function CentreView({ id }: { id: CentreId }) {
  const { t, c, lang } = useApp();
  const mine = useMine();
  const x = c.centres[id];
  return (
    <View style={{ gap: 14 }}>
      <Txt v="display" style={{ fontSize: 38 }}>{CENTRE_LABELS[lang][id]}</Txt>
      {mine ? <View style={{ flexDirection: 'row' }}><Pill text={`${t.yoursL}: ${mine.defined[id] ? t.defined : t.open}`} red /></View> : null}
      <Txt v="italic">{x.does}</Txt>
      <Section label={t.definedL}><Txt>{x.defined}</Txt></Section>
      <Section label={t.openL}><Txt>{x.open}</Txt></Section>
      <Section label={t.questionL}><Txt v="italic">{x.question}</Txt></Section>
    </View>
  );
}

function ProfileView({ id }: { id: string }) {
  const { t, c } = useApp();
  const mine = useMine();
  const lines = c.lines as Record<string, { name: string; text: string }>;
  const [a, b] = id.split('/');
  return (
    <View style={{ gap: 14 }}>
      <Txt v="display" style={{ fontSize: 44 }}>{id}</Txt>
      <YoursPill show={mine?.profile === id} />
      <Txt>{(c.profiles as Record<string, string>)[id]}</Txt>
      <Section label={t.linesL}>
        {[a, b].map((n) => (
          <Card key={n}>
            <Txt v="medium">{`${t.line} ${n} · ${lines[n]?.name}`}</Txt>
            <Txt>{lines[n]?.text}</Txt>
          </Card>
        ))}
      </Section>
    </View>
  );
}

function ChannelView({ id }: { id: string }) {
  const { t, lang } = useApp();
  const L = useLabels();
  const mine = useMine();
  const ch = L.channel(id);
  const [a, b] = id.split('-').map(Number);
  return (
    <View style={{ gap: 14 }}>
      <Txt v="label">{id}</Txt>
      <Txt v="display" style={{ fontSize: 38 }}>{ch.name}</Txt>
      <YoursPill show={!!mine?.channels.some((x) => x.key === id)} />
      <Txt v="small">{t.connects(CENTRE_LABELS[lang][GATE_CENTRE[a]], CENTRE_LABELS[lang][GATE_CENTRE[b]])}</Txt>
      <Txt>{ch.text}</Txt>
      <Txt>{CHANNELS_DEEP[lang][id]?.life}</Txt>
      <Card><Txt v="label" color={C.red}>{DEEP_UI[lang].gift}</Txt><Txt>{CHANNELS_DEEP[lang][id]?.gift}</Txt></Card>
      <Card><Txt v="label" color={C.red}>{DEEP_UI[lang].trapL}</Txt><Txt>{CHANNELS_DEEP[lang][id]?.watch}</Txt></Card>
      <Section>
        {[a, b].map((g) => <GateLink key={g} g={g} />)}
      </Section>
    </View>
  );
}

function GateView({ id }: { id: number }) {
  const { t, lang } = useApp();
  const L = useLabels();
  const mine = useMine();
  const x = L.gate(id);
  const chans = partnerGates(id);
  return (
    <View style={{ gap: 14 }}>
      <Txt v="label">{`${t.gate} ${id}`}</Txt>
      <Txt v="display" style={{ fontSize: 38 }}>{x?.name}</Txt>
      <YoursPill show={!!mine?.gates.includes(id)} />
      <Txt v="small">{t.inCentre(CENTRE_LABELS[lang][GATE_CENTRE[id]])}</Txt>
      <Txt>{x?.text}</Txt>
      <Card><Txt v="label" color={C.red}>{DEEP_UI[lang].gift}</Txt><Txt>{GATES_DEEP[lang][String(id)]?.gift}</Txt></Card>
      <Card><Txt v="label" color={C.red}>{DEEP_UI[lang].challenge}</Txt><Txt>{GATES_DEEP[lang][String(id)]?.shadow}</Txt></Card>
      <Section label={t.inChannels}>
        {chans.map((p) => (
          <Pressable key={p.key} onPress={() => go('channel', p.key)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: C.line }}>
            <Txt v="medium">{`${L.channel(p.key).name} · ${p.key}`}</Txt>
          </Pressable>
        ))}
      </Section>
    </View>
  );
}

function GateLink({ g }: { g: number }) {
  const { t } = useApp();
  const L = useLabels();
  const x = L.gate(g);
  return (
    <Card onPress={() => go('gate', String(g))}>
      <Txt v="medium">{`${t.gate} ${g} · ${x?.name}`}</Txt>
      <Txt v="small" numberOfLines={2}>{x?.text}</Txt>
    </Card>
  );
}
