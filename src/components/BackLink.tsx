import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';
import { useApp } from '../state/AppState';
import { C } from '../theme';
import { Txt, useDir } from './ui';

export function BackLink({ light }: { light?: boolean }) {
  const { rtl } = useApp();
  const { start } = useDir();
  if (!router.canGoBack()) return null;
  return (
    <Pressable onPress={() => router.back()} hitSlop={14} style={{ alignSelf: start, paddingVertical: 6 }} accessibilityRole="button" accessibilityLabel="Back">
      <Txt v="medium" color={light ? C.cream : undefined} style={{ fontSize: 22 }}>{rtl ? '→' : '←'}</Txt>
    </Pressable>
  );
}
