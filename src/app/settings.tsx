import Constants from 'expo-constants';
import { router } from 'expo-router';
import React from 'react';
import { Image, Linking, Pressable, View } from 'react-native';
import { BackLink } from '../components/BackLink';
import { Button, Card, Divider, Screen, Txt, useDir } from '../components/ui';
import { useApp } from '../state/AppState';
import { C } from '../theme';

export default function Settings() {
  const { t, lang, setLang, ent } = useApp();
  const { row } = useDir();
  return (
    <Screen>
      <BackLink />
      <Txt v="display" style={{ marginTop: 8 }}>{t.meTitle}</Txt>

      <Txt v="label" style={{ marginTop: 30, marginBottom: 12 }}>{t.language}</Txt>
      <View style={{ flexDirection: row, gap: 10 }}>
        {(['en', 'ar'] as const).map((l) => (
          <Pressable
            key={l}
            onPress={() => setLang(l)}
            style={{ flex: 1, minHeight: 50, borderRadius: 999, borderWidth: 1, borderColor: lang === l ? C.esp : C.line, backgroundColor: lang === l ? C.esp : C.card, alignItems: 'center', justifyContent: 'center' }}
          >
            <Txt v="medium" center color={lang === l ? C.cream : C.ink}>{l === 'en' ? 'English' : 'العربية'}</Txt>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <Button kind="ghost" title={t.editMe} onPress={() => router.push('/birth')} />
      </View>

      <Txt v="label" style={{ marginTop: 30, marginBottom: 12 }}>{t.plan}</Txt>
      <Card>
        <Txt v="title" style={{ fontSize: 26, lineHeight: 34 }}>
          {ent.tier === 'gold' ? t.gold : ent.tier === 'silver' ? t.silver : t.freePlan}
        </Txt>
        {ent.myChart && !ent.tier ? <Txt v="small">{`${t.onceChart} · ${t.unlocked}`}</Txt> : null}
        <View style={{ marginTop: 6 }}>
          <Button title={t.managePlan} onPress={() => router.push('/paywall')} />
        </View>
      </Card>

      <Divider />
      <Card>
        <View style={{ flexDirection: row, alignItems: 'center', gap: 12 }}>
          <Image source={require('../../assets/seal.png')} style={{ width: 40, height: 40 }} />
          <Txt v="title" style={{ fontSize: 24, lineHeight: 34 }}>{t.brand}</Txt>
        </View>
        <Txt>{t.aboutText}</Txt>
        <Pressable onPress={() => Linking.openURL('https://humanbydesign.global')}>
          <Txt v="medium" color={C.red}>{t.website}</Txt>
        </Pressable>
      </Card>
      <Txt v="small" style={{ marginTop: 20 }}>{t.privacy}</Txt>
      <Txt v="small" style={{ marginTop: 10 }}>{t.disclaimer}</Txt>
      <Txt v="small" style={{ marginTop: 10 }}>{`${t.version} ${Constants.expoConfig?.version ?? ''}`}</Txt>
    </Screen>
  );
}
