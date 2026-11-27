import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconAsk, IconChart, IconMe, IconPeople, IconToday } from '../../components/icons';
import { useApp } from '../../state/AppState';
import { C, F } from '../../theme';

export const unstable_settings = { initialRouteName: 'index' };

export default function TabsLayout() {
  const { me, t, rtl } = useApp();
  const insets = useSafeAreaInsets();
  if (!me) return <Redirect href="/welcome" />;
  const screens = [
    { name: 'index', title: t.tToday, Icon: IconToday },
    { name: 'chart', title: t.tChart, Icon: IconChart },
    { name: 'ask', title: t.tAsk, Icon: IconAsk },
    { name: 'people', title: t.tPeople, Icon: IconPeople },
    { name: 'settings', title: t.tMe, Icon: IconMe },
  ];
  // In Arabic the tab order reads right to left.
  const ordered = rtl ? [...screens].reverse() : screens;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.red,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.card, borderTopColor: C.line, height: 64 + insets.bottom, paddingTop: 6, paddingBottom: insets.bottom + 8 },
        tabBarLabelStyle: { fontFamily: rtl ? F.arRegular : F.sansRegular, fontSize: 11, lineHeight: 16, overflow: 'visible' },
        sceneStyle: { backgroundColor: C.paper },
      }}
    >
      {ordered.map(({ name, title, Icon }) => (
        <Tabs.Screen key={name} name={name} options={{ title, tabBarIcon: ({ color }) => <Icon color={String(color)} /> }} />
      ))}
    </Tabs>
  );
}
