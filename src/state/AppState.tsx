// App state: language, your profile and your people. Stored on the phone for
// now (private, free, works offline). The Profile shape is what a future
// account/sync backend will store, so nothing needs reshaping later.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { chart, localToUtc, parseBirth, type Chart } from '../engine/hd';
import { STRINGS, type Lang, type Strings } from '../i18n/strings';
import { access, NO_ENTITLEMENTS, PRODUCTS, type Entitlements, type ProductKey } from '../billing/plans';
import { buy, initStore, restore, type BuyResult } from '../billing/store';
import EN from '../content/en.json';
import AR from '../content/ar.json';

export interface Place { name: string; country?: string; admin1?: string; latitude: number; longitude: number; timezone: string }
export interface Profile {
  id: string;
  name: string;
  relation?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM, local time at the birth place
  place: Place;
  createdAt: number;
}
export type Content = typeof EN;

interface Ctx {
  ready: boolean;
  lang: Lang;
  rtl: boolean;
  t: Strings;
  c: Content;
  setLang: (l: Lang) => void;
  me: Profile | null;
  people: Profile[];
  saveMe: (p: Omit<Profile, 'id' | 'createdAt'>) => void;
  addPerson: (p: Omit<Profile, 'id' | 'createdAt'>) => Profile;
  removePerson: (id: string) => void;
  chartOf: (p: Profile) => Chart;
  ent: Entitlements;
  can: ReturnType<typeof access>;
  purchase: (k: ProductKey) => Promise<BuyResult>;
  restorePurchases: () => Promise<boolean>;
  aiUsed: number;
  noteAiUsed: () => void;
}

const KEY = 'hbd.v1';
const AppCtx = createContext<Ctx | null>(null);

const chartCache = new Map<string, Chart>();
export function computeChart(p: Pick<Profile, 'date' | 'time' | 'place'>): Chart {
  const k = `${p.date}|${p.time}|${p.place.timezone}`;
  const hit = chartCache.get(k);
  if (hit) return hit;
  const b = parseBirth(p.date, p.time);
  if (!b) throw new Error('bad birth data');
  const c = chart(localToUtc(b.y, b.mo, b.d, b.h, b.mi, p.place.timezone));
  chartCache.set(k, c);
  return c;
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lang, setLangState] = useState<Lang>(() => (getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en'));
  const [me, setMe] = useState<Profile | null>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [openedAt] = useState<number>(() => Date.now());
  const [startedAt, setStartedAt] = useState<number>(openedAt);
  const [aiUsed, setAiUsed] = useState(0);
  const [storeEnt, setStoreEnt] = useState<Entitlements>(NO_ENTITLEMENTS);
  // Development preview only: purchases made while the store isn't connected.
  const [previewEnt, setPreviewEnt] = useState<Entitlements>(NO_ENTITLEMENTS);

  useEffect(() => { initStore().then(setStoreEnt); }, []);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const s = JSON.parse(raw);
        if (s.lang) setLangState(s.lang);
        if (s.me) setMe(s.me);
        if (Array.isArray(s.people)) setPeople(s.people);
        if (s.startedAt) setStartedAt(s.startedAt);
        if (s.aiUsed) setAiUsed(s.aiUsed);
        if (__DEV__ && s.previewEnt) setPreviewEnt(s.previewEnt);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify({ v: 1, lang, me, people, startedAt, aiUsed, previewEnt: __DEV__ ? previewEnt : undefined })).catch(() => {});
  }, [ready, lang, me, people, startedAt, aiUsed, previewEnt]);

  const saveMe = useCallback((p: Omit<Profile, 'id' | 'createdAt'>) => {
    setMe((old) => ({ ...p, id: old?.id ?? uid(), createdAt: old?.createdAt ?? Date.now() }));
  }, []);
  const addPerson = useCallback((p: Omit<Profile, 'id' | 'createdAt'>) => {
    const np = { ...p, id: uid(), createdAt: Date.now() };
    setPeople((list) => [np, ...list]);
    return np;
  }, []);
  const removePerson = useCallback((id: string) => setPeople((list) => list.filter((x) => x.id !== id)), []);

  const ent: Entitlements = {
    tier: storeEnt.tier === 'gold' || previewEnt.tier === 'gold' ? 'gold' : storeEnt.tier ?? previewEnt.tier,
    myChart: storeEnt.myChart || previewEnt.myChart,
    peopleCredits: storeEnt.peopleCredits + previewEnt.peopleCredits,
  };
  const daysSinceStart = Math.floor((openedAt - startedAt) / 86400000);
  const can = access(ent, { daysSinceStart, aiUsed, people: people.length });

  const purchase = useCallback(async (k: ProductKey) => {
    const r = await buy(k);
    if (r.ok && r.ent) setStoreEnt(r.ent);
    else if (r.ok) {
      const p = PRODUCTS[k];
      setPreviewEnt((e) => ({
        tier: p.tier === 'gold' || e.tier === 'gold' ? 'gold' : p.tier ?? e.tier,
        myChart: e.myChart || k === 'my_chart',
        peopleCredits: e.peopleCredits + (k === 'my_people' ? 1 : 0),
      }));
    }
    return r;
  }, []);
  const restorePurchases = useCallback(async () => {
    const e = await restore();
    if (e) setStoreEnt(e);
    return !!e;
  }, []);
  const noteAiUsed = useCallback(() => setAiUsed((n) => n + 1), []);

  const value: Ctx = {
    ready, lang, rtl: lang === 'ar', t: STRINGS[lang], c: (lang === 'ar' ? AR : EN) as Content,
    setLang: setLangState, me, people, saveMe, addPerson, removePerson, chartOf: computeChart,
    ent, can, purchase, restorePurchases, aiUsed, noteAiUsed,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const v = useContext(AppCtx);
  if (!v) throw new Error('useApp outside provider');
  return v;
}
