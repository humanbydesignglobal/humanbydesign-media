import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { C } from '../theme';
import { Button, Card, Txt } from './ui';

/** A gentle locked block that opens the plans screen. */
export function Lock({ title, text, cta, onPress }: { title?: string; text: string; cta: string; onPress?: () => void }) {
  return (
    <Card dark style={{ gap: 14, paddingVertical: 26 }}>
      {title ? <Txt v="hand" color={C.redDark}>{title}</Txt> : null}
      <Txt color={C.cream}>{text}</Txt>
      <View style={{ marginTop: 4 }}>
        <Button kind="light" title={cta} onPress={onPress ?? (() => router.push('/paywall'))} />
      </View>
    </Card>
  );
}
