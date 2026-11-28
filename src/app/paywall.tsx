import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Pressable, View } from 'react-native';
import { type ProductKey, type Tier } from '../billing/plans';
import { hasFreeTrial, previewPurchases, priceOf, storeConnected } from '../billing/store';
import { BackLink } from '../components/BackLink';
import { Button, Screen, Txt, useDir } from '../components/ui';
import { useApp } from '../state/AppState';
import { C } from '../theme';

export default function Paywall() {
  const { t, ent, purchase, restorePurchases } = useApp();
  const { row } = useDir();
  const [period, setPeriod] = useState<'month' | 'year'>('year');
  const [tier, setTier] = useState<Tier>('gold');
  const [busy, setBusy] = useState<ProductKey | 'restore' | null>(null);
  const [msg, setMsg] = useState('');

  const subKey = `${tier}_${period === 'month' ? 'monthly' : 'yearly'}` as ProductKey;
  const per = period === 'month' ? t.perMonth : t.perYear;

  async function go(k: ProductKey) {
    setMsg('');
    setBusy(k);
    const r = await purchase(k);
    setBusy(null);
    if (r.ok) router.back();
    else if (r.unavailable) setMsg(t.unavailable);
  }
  async function doRestore() {
    setBusy('restore');
    const ok = await restorePurchases();
    setBusy(null);
    setMsg(!storeConnected ? t.unavailable : ok ? t.restored : t.nothingRestored);
  }

  const tierCard = (k: Tier) => {
    const on = tier === k;
    const key = `${k}_${period === 'month' ? 'monthly' : 'yearly'}` as ProductKey;
    const features = k === 'gold' ? t.goldFeatures : t.silverFeatures;
    const current = ent.tier === k;
    return (
      <Pressable
        key={k}
        onPress={() => setTier(k)}
        accessibilityRole="radio"
        accessibilityState={{ selected: on }}
        style={{ borderRadius: 20, borderWidth: 1.5, borderColor: on ? C.redDark : 'rgba(244,238,230,0.2)', backgroundColor: on ? C.esp2 : 'transparent', padding: 20, gap: 10 }}
      >
        <View style={{ flexDirection: row, alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Txt v="title" color={C.cream} style={{ fontSize: 28, lineHeight: 34 }}>{k === 'gold' ? t.gold : t.silver}</Txt>
          <Txt v="medium" color={C.cream}>{`${priceOf(key)} ${per}`}</Txt>
        </View>
        {current ? <Txt v="label" color={C.redDark}>{t.current}</Txt> : null}
        {!current && hasFreeTrial(key) ? <Txt v="label" color={C.redDark}>{t.trialBadge}</Txt> : null}
        {features.map((f) => (
          <View key={f} style={{ flexDirection: row, gap: 10, alignItems: 'flex-start' }}>
            <Txt color={C.redDark}>✓</Txt>
            <Txt color={C.mutedDark} style={{ flex: 1 }}>{f}</Txt>
          </View>
        ))}
      </Pressable>
    );
  };

  const once = (k: ProductKey, title: string, note: string, owned?: boolean) => (
    <Pressable
      onPress={() => !owned && go(k)}
      disabled={owned || !!busy}
      style={({ pressed }) => ({ flexDirection: row, alignItems: 'center', gap: 12, paddingVertical: 16, borderTopWidth: 1, borderColor: 'rgba(244,238,230,0.15)', opacity: pressed ? 0.7 : 1 })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt v="medium" color={C.cream}>{title}</Txt>
        <Txt v="small" color={C.mutedDark}>{note}</Txt>
      </View>
      <Txt v="medium" color={owned ? C.mutedDark : C.cream}>{owned ? t.unlocked : priceOf(k)}</Txt>
    </Pressable>
  );

  return (
    <Screen dark>
      <BackLink light />
      <View style={{ alignItems: 'center', gap: 14, marginTop: 4 }}>
        <Image source={require('../../assets/seal.png')} style={{ width: 64, height: 64 }} />
        <Txt v="display" center color={C.cream} style={{ fontSize: 38 }}>{t.pwTitle}</Txt>
        <Txt center color={C.mutedDark}>{t.pwLead}</Txt>
      </View>

      <View style={{ flexDirection: row, marginTop: 26, marginBottom: 16, backgroundColor: C.esp2, borderRadius: 999, padding: 4 }}>
        {(['month', 'year'] as const).map((p) => (
          <Pressable key={p} onPress={() => setPeriod(p)} style={{ flex: 1, minHeight: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: period === p ? C.cream : 'transparent' }}>
            <Txt v="medium" center color={period === p ? C.esp : C.cream} style={{ fontSize: 14 }}>
              {p === 'month' ? t.monthly : `${t.yearly} · ${t.yearlySave}`}
            </Txt>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        {tierCard('gold')}
        {tierCard('silver')}
      </View>

      <View style={{ marginTop: 18 }}>
        <Button kind="light" title={hasFreeTrial(subKey) ? t.startTrial : t.choose(`${priceOf(subKey)} ${per}`)} loading={busy === subKey} onPress={() => go(subKey)} />
        {hasFreeTrial(subKey) ? (
          <Txt v="small" center color={C.cream} style={{ marginTop: 10 }}>{t.trialThen(`${priceOf(subKey)} ${per}`)}</Txt>
        ) : null}
      </View>

      <Txt v="label" color={C.redDark} style={{ marginTop: 34, marginBottom: 4 }}>{t.orOnce}</Txt>
      {once('my_chart', t.onceChart, t.onceChartNote, ent.myChart || ent.tier !== null)}
      {once('my_people', t.oncePeople, t.oncePeopleNote, ent.tier !== null)}

      {msg ? <Txt center color={C.redDark} style={{ marginTop: 16 }}>{msg}</Txt> : null}
      {previewPurchases ? <Txt v="small" center color={C.mutedDark} style={{ marginTop: 16 }}>{t.previewNote}</Txt> : null}

      <Pressable onPress={doRestore} style={{ alignSelf: 'center', padding: 14, marginTop: 10 }}>
        <Txt v="medium" color={C.cream}>{busy === 'restore' ? '…' : t.restore}</Txt>
      </Pressable>
      <Txt v="small" center color={C.mutedDark} style={{ fontSize: 12, lineHeight: 18 }}>{t.legal}</Txt>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 12 }}>
        <Pressable onPress={() => Linking.openURL('https://humanbydesign.global/terms')}><Txt v="small" color={C.cream}>{t.terms}</Txt></Pressable>
        <Pressable onPress={() => Linking.openURL('https://humanbydesign.global/privacy')}><Txt v="small" color={C.cream}>{t.privacyPolicy}</Txt></Pressable>
      </View>
    </Screen>
  );
}
