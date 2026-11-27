import React from 'react';
import {
  ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
  type TextInputProps, type TextProps, type ViewStyle, type StyleProp,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../state/AppState';
import { C, F, S } from '../theme';

export function useDir() {
  const { rtl } = useApp();
  return {
    rtl,
    row: (rtl ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    align: (rtl ? 'right' : 'left') as 'right' | 'left',
    start: (rtl ? 'flex-end' : 'flex-start') as 'flex-end' | 'flex-start',
  };
}

type Variant = 'body' | 'small' | 'label' | 'title' | 'display' | 'italic' | 'hand' | 'medium';

export function Txt({ v = 'body', style, children, center, color, ...rest }: TextProps & { v?: Variant; center?: boolean; color?: string }) {
  const { rtl, align } = useDir();
  const base = rtl ? AR_STYLE[v] : EN_STYLE[v];
  return (
    <Text
      {...rest}
      style={[base, { textAlign: center ? 'center' : align, writingDirection: rtl ? 'rtl' : 'ltr' }, color ? { color } : null, style]}
    >
      {children}
    </Text>
  );
}

const EN_STYLE = StyleSheet.create({
  body: { fontFamily: F.sans, fontSize: 16, lineHeight: 25, color: C.ink },
  small: { fontFamily: F.sans, fontSize: 13.5, lineHeight: 20, color: C.muted },
  medium: { fontFamily: F.sansMedium, fontSize: 16, lineHeight: 23, color: C.ink },
  label: { fontFamily: F.sansMedium, fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: C.red },
  title: { fontFamily: F.serif, fontSize: 30, lineHeight: 33, color: C.ink, letterSpacing: -0.3 },
  display: { fontFamily: F.serif, fontSize: 44, lineHeight: 45, color: C.ink, letterSpacing: -0.6 },
  italic: { fontFamily: F.serifItalic, fontSize: 24, lineHeight: 28, color: C.ink },
  hand: { fontFamily: F.hand, fontSize: 32, lineHeight: 32, color: C.red },
});
const AR_STYLE = StyleSheet.create({
  body: { fontFamily: F.ar, fontSize: 16.5, lineHeight: 29, color: C.ink },
  small: { fontFamily: F.ar, fontSize: 14, lineHeight: 23, color: C.muted },
  medium: { fontFamily: F.arMedium, fontSize: 16.5, lineHeight: 26, color: C.ink },
  label: { fontFamily: F.arMedium, fontSize: 13, color: C.red },
  title: { fontFamily: 'Amiri_400Regular', fontSize: 29, lineHeight: 44, color: C.ink },
  display: { fontFamily: 'Amiri_400Regular', fontSize: 38, lineHeight: 60, color: C.ink },
  italic: { fontFamily: 'Amiri_400Regular_Italic', fontSize: 23, lineHeight: 36, color: C.ink },
  hand: { fontFamily: F.arHand, fontSize: 25, lineHeight: 38, color: C.red },
});

export function Screen({ children, dark, scroll = true, style }: { children: React.ReactNode; dark?: boolean; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const bg = dark ? C.esp : C.paper;
  const pad = { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 40, paddingHorizontal: S.pad };
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: bg }, pad, style]}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={[pad, { maxWidth: 640, width: '100%', alignSelf: 'center' }, style]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Card({ children, style, dark, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; dark?: boolean; onPress?: () => void }) {
  const st = [styles.card, dark && { backgroundColor: C.esp, borderColor: C.esp }, style];
  if (onPress)
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [st, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  return <View style={st}>{children}</View>;
}

export function Button({ title, onPress, kind = 'solid', loading, disabled }: { title: string; onPress: () => void; kind?: 'solid' | 'ghost' | 'light' | 'outlineLight'; loading?: boolean; disabled?: boolean }) {
  const solid = kind === 'solid', light = kind === 'light', ol = kind === 'outlineLight';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        solid && { backgroundColor: C.esp, borderColor: C.esp },
        light && { backgroundColor: C.cream, borderColor: C.cream },
        ol && { borderColor: 'rgba(244,238,230,0.4)' },
        (pressed || disabled) && { opacity: 0.75 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={solid || ol ? C.cream : C.esp} />
      ) : (
        <Txt v="medium" center color={solid || ol ? C.cream : C.esp} style={{ fontSize: 15 }}>{title}</Txt>
      )}
    </Pressable>
  );
}

export function Field({ label, style, ...rest }: TextInputProps & { label?: string }) {
  const { rtl, align } = useDir();
  return (
    <View style={{ gap: 6, flex: 1 }}>
      {label ? <Txt v="small">{label}</Txt> : null}
      <TextInput
        placeholderTextColor="#A2978E"
        {...rest}
        style={[styles.input, { textAlign: align, fontFamily: rtl ? F.ar : F.sans, writingDirection: rtl ? 'rtl' : 'ltr' }, style]}
      />
    </View>
  );
}

export function Pill({ text, red }: { text: string; red?: boolean }) {
  return (
    <View style={[styles.pill, red && { backgroundColor: C.red, borderColor: C.red }]}>
      <Txt v="small" color={red ? C.white : C.ink} style={{ fontSize: 12.5, lineHeight: 16 }}>{text}</Txt>
    </View>
  );
}

export function Divider() {
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: C.line, marginVertical: 22 }} />;
}

export function Section({ label, title, children }: { label?: string; title?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 34, gap: 12 }}>
      {label ? <Txt v="label">{label}</Txt> : null}
      {title ? <Txt v="title">{title}</Txt> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: S.radius, padding: 22, borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, gap: 10 },
  btn: { minHeight: 54, borderRadius: 999, borderWidth: 1, borderColor: C.esp, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, paddingHorizontal: 14, fontSize: 16, color: C.ink },
  pill: { borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: C.card },
});
