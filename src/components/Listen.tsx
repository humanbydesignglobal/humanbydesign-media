import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { Txt, useDir } from './ui';

const BASE = 'https://humanbydesign.global/voice/';
type Manifest = { clips: Record<string, { file: string }> };
let cache: Promise<Manifest | null> | null = null;
const manifest = () =>
  (cache ??= fetch(BASE + 'manifest.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : null))
    .catch(() => { cache = null; return null; }));

/** The URL of a clip in Cici's voice, once it exists on the site. */
export function useVoice(key: string) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    manifest().then((m) => { const f = m?.clips[key]?.file; if (live) setUrl(f ? BASE + f : null); });
    return () => { live = false; };
  }, [key]);
  return url;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** "Listen" button with Cici's voice. Renders nothing until the audio exists. */
export function Listen({ voiceKey, dark, compact }: { voiceKey: string; dark?: boolean; compact?: boolean }) {
  const url = useVoice(voiceKey);
  return url ? <Player url={url} dark={dark} compact={compact} /> : null;
}

function Player({ url, dark, compact }: { url: string; dark?: boolean; compact?: boolean }) {
  const { t } = useApp();
  const { row, rtl } = useDir();
  const player = useAudioPlayer({ uri: url });
  const st = useAudioPlayerStatus(player);
  useEffect(() => { setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}); }, []);
  const fg = dark ? C.cream : C.ink;
  const toggle = () => {
    if (st.playing) return player.pause();
    if (st.duration && st.currentTime >= st.duration - 0.3) player.seekTo(0);
    player.play();
  };
  const pct = st.duration ? Math.min(1, st.currentTime / st.duration) : 0;
  return (
    <Pressable onPress={toggle} accessibilityRole="button" accessibilityLabel={st.playing ? t.pauseL : t.listenL}
      style={({ pressed }) => ({ flexDirection: row, alignItems: 'center', gap: 12, paddingVertical: compact ? 8 : 12, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: dark ? 'rgba(244,238,230,0.25)' : C.line, opacity: pressed ? 0.8 : 1, alignSelf: rtl ? 'flex-end' : 'flex-start' })}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={12} height={12} viewBox="0 0 12 12">
          {st.playing ? (<><Rect x={2} y={1} width={3} height={10} rx={1} fill="#fff" /><Rect x={7} y={1} width={3} height={10} rx={1} fill="#fff" /></>) : <Path d="M3 1.2v9.6L10.6 6z" fill="#fff" />}
        </Svg>
      </View>
      <View style={{ gap: 4 }}>
        <Txt v="medium" color={fg} style={{ fontSize: 14 }}>{st.playing || st.currentTime > 0 ? `${fmt(st.currentTime)} / ${fmt(st.duration || 0)}` : t.listenL}</Txt>
        <View style={{ width: 110, height: 3, borderRadius: 2, backgroundColor: dark ? 'rgba(244,238,230,0.2)' : C.paper2 }}>
          <View style={{ width: 110 * pct, height: 3, borderRadius: 2, backgroundColor: C.red }} />
        </View>
      </View>
    </Pressable>
  );
}
