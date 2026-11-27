import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { priceOf } from '../../billing/store';
import { useLabels } from '../../components/ChartView';
import { TypeSeal } from '../../components/TypeSeal';
import { Button, Card, Screen, Txt, useDir } from '../../components/ui';
import { useApp } from '../../state/AppState';
import { C } from '../../theme';

export default function People() {
  const { t, people, chartOf, can, purchase } = useApp();
  const L = useLabels();
  const { row } = useDir();

  async function buyPerson() {
    const r = await purchase('my_people');
    if (r.ok) router.push('/add-person');
    else if (r.unavailable) router.push('/paywall');
  }

  return (
    <Screen>
      <Txt v="display">{t.peopleTitle}</Txt>
      <Txt v="small" style={{ marginTop: 8, marginBottom: 24 }}>{t.peopleLead}</Txt>
      <View style={{ gap: 12 }}>
        {people.length === 0 ? (
          <Card>
            <Txt>{t.emptyPeople}</Txt>
          </Card>
        ) : null}
        {people.map((p) => {
          const c = chartOf(p);
          return (
            <Card key={p.id} onPress={() => router.push({ pathname: '/person/[id]', params: { id: p.id } })}>
              <View style={{ flexDirection: row, alignItems: 'center', gap: 14 }}>
                <TypeSeal type={c.type} size={54} />
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt v="medium">{p.name}</Txt>
                  <Txt v="small">{[L.type(c.type).name, L.auth(c.authority), c.profile].join(' · ')}</Txt>
                  {p.relation ? <Txt v="small" style={{ fontSize: 12.5 }}>{p.relation}</Txt> : null}
                </View>
              </View>
            </Card>
          );
        })}
        {can.canAddPerson ? (
          <View style={{ marginTop: 12 }}>
            <Button title={t.addPerson} onPress={() => router.push('/add-person')} />
          </View>
        ) : (
          <Card dark style={{ marginTop: 12, gap: 14, paddingVertical: 24 }}>
            <Txt color={C.cream}>{t.peopleLocked}</Txt>
            <Button kind="light" title={`${t.oncePeople} · ${priceOf('my_people')}`} onPress={buyPerson} />
            <Button kind="outlineLight" title={t.managePlan} onPress={() => router.push('/paywall')} />
          </Card>
        )}
      </View>
    </Screen>
  );
}
