import { Amiri_400Regular } from '@expo-google-fonts/amiri/400Regular';
import { Amiri_400Regular_Italic } from '@expo-google-fonts/amiri/400Regular_Italic';
import { ArefRuqaa_400Regular } from '@expo-google-fonts/aref-ruqaa/400Regular';
import { IBMPlexSansArabic_300Light } from '@expo-google-fonts/ibm-plex-sans-arabic/300Light';
import { IBMPlexSansArabic_400Regular } from '@expo-google-fonts/ibm-plex-sans-arabic/400Regular';
import { IBMPlexSansArabic_500Medium } from '@expo-google-fonts/ibm-plex-sans-arabic/500Medium';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif/400Regular';
import { InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif/400Regular_Italic';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { ReenieBeanie_400Regular } from '@expo-google-fonts/reenie-beanie/400Regular';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useApp } from '../state/AppState';
import { C } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root() {
  const { ready } = useApp();
  const [fontsLoaded] = useFonts({
    InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic,
    Inter_300Light, Inter_400Regular, Inter_500Medium,
    ReenieBeanie_400Regular,
    IBMPlexSansArabic_300Light, IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium,
    ArefRuqaa_400Regular, Amiri_400Regular, Amiri_400Regular_Italic,
  });
  const done = ready && fontsLoaded;
  useEffect(() => { if (done) SplashScreen.hideAsync().catch(() => {}); }, [done]);
  if (!done) return null;
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.paper } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
        <Stack.Screen name="birth" />
        <Stack.Screen name="add-person" options={{ presentation: 'modal' }} />
        <Stack.Screen name="person/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="learn/[kind]/[id]" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal', contentStyle: { backgroundColor: C.esp } }} />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <Root />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
