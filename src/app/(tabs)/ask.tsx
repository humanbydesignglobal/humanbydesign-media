import Constants from 'expo-constants';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Lock } from '../../components/Lock';
import { Txt, useDir } from '../../components/ui';
import { useApp } from '../../state/AppState';
import { C, F } from '../../theme';

const ASK_URL =
  (Constants.expoConfig?.extra as { askUrl?: string } | undefined)?.askUrl || 'https://humanbydesign.global/.netlify/functions/ask';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function Ask() {
  const { t, lang, me, chartOf, can, noteAiUsed } = useApp();
  const { row, align, rtl } = useDir();
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);
  if (!me) return null;
  const chart = chartOf(me);
  const left = can.aiLeft;

  async function send(q: string) {
    const question = q.trim();
    if (!question || busy || left <= 0 || !ASK_URL) return;
    setErr('');
    const next: Msg[] = [...msgs, { role: 'user', content: question }];
    setMsgs(next);
    setText('');
    setBusy(true);
    try {
      const summary = {
        type: chart.type, authority: chart.authority, profile: chart.profile, definition: chart.definition,
        defined: Object.keys(chart.defined), channels: chart.channels.map((c) => `${c.key} ${c.name}`),
        personality: chart.personality.map((a) => `${a.planet} ${a.gate}.${a.line}`),
        design: chart.design.map((a) => `${a.planet} ${a.gate}.${a.line}`),
      };
      const r = await fetch(ASK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ lang, name: me!.name, chart: summary, messages: next }),
      });
      if (r.status === 503) {
        setErr(t.askNotLive);
        setMsgs(msgs);
        setText(question);
        return;
      }
      const j = await r.json();
      if (!r.ok || !j.text) throw new Error('ask failed');
      setMsgs([...next, { role: 'assistant', content: j.text }]);
      noteAiUsed();
    } catch {
      setErr(t.askErr);
      setMsgs(msgs);
      setText(question);
    } finally {
      setBusy(false);
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.paper }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scroll} contentContainerStyle={{ paddingTop: insets.top + 18, paddingHorizontal: 24, paddingBottom: 24, gap: 14, maxWidth: 640, width: '100%', alignSelf: 'center' }} keyboardShouldPersistTaps="handled">
        <Txt v="display">{t.askTitle}</Txt>
        <Txt v="small">{t.askLead}</Txt>
        {msgs.length === 0 && left > 0 && ASK_URL ? (
          <View style={{ gap: 10, marginTop: 8 }}>
            {t.askSuggest.map((s) => (
              <Pressable key={s} onPress={() => send(s)} style={{ borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, backgroundColor: C.card }}>
                <Txt>{s}</Txt>
              </Pressable>
            ))}
          </View>
        ) : null}
        {msgs.map((m, i) => (
          <View
            key={i}
            style={{
              alignSelf: m.role === 'user' ? (rtl ? 'flex-start' : 'flex-end') : 'stretch',
              maxWidth: m.role === 'user' ? '85%' : '100%',
              backgroundColor: m.role === 'user' ? C.esp : C.card,
              borderRadius: 18, padding: 16, borderWidth: m.role === 'user' ? 0 : 1, borderColor: C.line,
            }}
          >
            <Txt color={m.role === 'user' ? C.cream : C.ink}>{m.content}</Txt>
          </View>
        ))}
        {busy ? (
          <View style={{ flexDirection: row, gap: 10, alignItems: 'center' }}>
            <ActivityIndicator color={C.red} />
            <Txt v="small">{t.askThinking}</Txt>
          </View>
        ) : null}
        {err ? <Txt color={C.red}>{err}</Txt> : null}
        {left <= 0 ? <Lock text={t.askLocked} cta={t.managePlan} /> : null}
      </ScrollView>
      {left > 0 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderColor: C.line, backgroundColor: C.card, gap: 6 }}>
          {!ASK_URL ? <Txt v="small" center>{t.askNotLive}</Txt> : left !== Infinity ? <Txt v="small" center>{t.askFreeLeft(left)}</Txt> : null}
          <View style={{ flexDirection: row, gap: 10, alignItems: 'flex-end' }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t.askPh}
              placeholderTextColor="#A2978E"
              multiline
              style={{ flex: 1, minHeight: 46, maxHeight: 120, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: C.ink, textAlign: align, fontFamily: rtl ? F.ar : F.sans }}
            />
            <Pressable
              onPress={() => send(text)}
              disabled={busy || !text.trim() || !ASK_URL}
              style={{ minHeight: 46, paddingHorizontal: 18, borderRadius: 999, backgroundColor: C.esp, alignItems: 'center', justifyContent: 'center', opacity: busy || !text.trim() || !ASK_URL ? 0.5 : 1 }}
            >
              <Txt v="medium" color={C.cream} style={{ fontSize: 15 }}>{t.askSend}</Txt>
            </Pressable>
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
