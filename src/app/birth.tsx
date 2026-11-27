import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { BirthForm } from '../components/BirthForm';
import { BackLink } from '../components/BackLink';
import { Screen, Txt } from '../components/ui';
import { useApp } from '../state/AppState';

// Your own birth details: first time, and later from Settings.
export default function Birth() {
  const { t, me, saveMe } = useApp();
  return (
    <Screen>
      <BackLink />
      <View style={{ gap: 12, marginBottom: 26, marginTop: 10 }}>
        <Txt v="display">{t.formTitleMe}</Txt>
        <Txt v="small">{t.formLead}</Txt>
      </View>
      <BirthForm
        initial={me}
        onDone={(p) => {
          saveMe(p);
          router.replace('/chart');
        }}
      />
    </Screen>
  );
}
