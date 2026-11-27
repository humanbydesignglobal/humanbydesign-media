import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Button, Screen, Txt, useDir } from '../components/ui';
import { useApp } from '../state/AppState';
import { C } from '../theme';

export default function Welcome() {
  const { t, lang, setLang } = useApp();
  const { start } = useDir();
  return (
    <Screen dark style={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={require('../../assets/seal.png')} style={{ width: 46, height: 46 }} />
        <Pressable onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')} hitSlop={12} style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(244,238,230,0.3)' }}>
          <Txt v="small" color={C.cream}>{t.chooseLang}</Txt>
        </Pressable>
      </View>
      <View style={{ gap: 18, alignItems: start, marginVertical: 48 }}>
        <Txt v="label" color={C.redDark}>{t.brand}</Txt>
        <Txt v="display" color={C.cream}>{t.welcomeTitle}</Txt>
        <Txt v="italic" color={C.cream} style={{ fontSize: 28, lineHeight: lang === 'ar' ? 44 : 32 }}>{t.welcomeItalic}</Txt>
        <Txt color={C.mutedDark} style={{ marginTop: 8 }}>{t.welcomeLead}</Txt>
      </View>
      <View style={{ gap: 14 }}>
        <Button kind="light" title={t.begin} onPress={() => router.push('/birth')} />
        <Txt v="hand" center color={C.redDark}>{t.tagline}</Txt>
      </View>
    </Screen>
  );
}
