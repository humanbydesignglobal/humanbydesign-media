import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { BackLink } from '../components/BackLink';
import { BirthForm } from '../components/BirthForm';
import { Screen, Txt } from '../components/ui';
import { useApp } from '../state/AppState';

export default function AddPerson() {
  const { t, addPerson, can } = useApp();
  const [allowed] = useState(can.canAddPerson);
  if (!allowed) return <Redirect href="/paywall" />;
  return (
    <Screen>
      <BackLink />
      <View style={{ gap: 12, marginBottom: 26, marginTop: 10 }}>
        <Txt v="display">{t.formTitleOther}</Txt>
        <Txt v="small">{t.formLead}</Txt>
      </View>
      <BirthForm
        other
        onDone={(p) => {
          const np = addPerson(p);
          router.replace({ pathname: '/person/[id]', params: { id: np.id } });
        }}
      />
    </Screen>
  );
}
