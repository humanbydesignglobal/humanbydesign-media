// Pricing mirrors Align: The Human Design App (US App Store listing, Nov 2026):
//   Silver  $9.99 / month   ·  $99.99 / year
//   Gold    $14.99 / month  ·  $149.99 / year
//   My Chart  $14.99 one-time (full reading of your chart)
//   My People $0.99 one-time (one more person's chart)
// Free version, like Align's: your chart, 5 days of daily tips, one person, one AI question.
// Prices shown in the app come from the store when connected (local currency, e.g. AED);
// these USD values are the fallback and the tiers to pick in App Store Connect / Play Console.

export type Tier = 'silver' | 'gold';
export type ProductKey = 'silver_monthly' | 'silver_yearly' | 'gold_monthly' | 'gold_yearly' | 'my_chart' | 'my_people';

export interface Product {
  key: ProductKey;
  id: string; // store product id (same on iOS and Android)
  usd: string;
  kind: 'subscription' | 'once' | 'consumable';
  tier?: Tier;
  period?: 'month' | 'year';
}

export const PRODUCTS: Record<ProductKey, Product> = {
  silver_monthly: { key: 'silver_monthly', id: 'hbd_silver_monthly', usd: '$9.99', kind: 'subscription', tier: 'silver', period: 'month' },
  silver_yearly: { key: 'silver_yearly', id: 'hbd_silver_yearly', usd: '$99.99', kind: 'subscription', tier: 'silver', period: 'year' },
  gold_monthly: { key: 'gold_monthly', id: 'hbd_gold_monthly', usd: '$14.99', kind: 'subscription', tier: 'gold', period: 'month' },
  gold_yearly: { key: 'gold_yearly', id: 'hbd_gold_yearly', usd: '$149.99', kind: 'subscription', tier: 'gold', period: 'year' },
  my_chart: { key: 'my_chart', id: 'hbd_my_chart', usd: '$14.99', kind: 'once' },
  my_people: { key: 'my_people', id: 'hbd_my_people', usd: '$0.99', kind: 'consumable' },
};

export const FREE = { tipDays: 5, people: 1, aiQuestions: 1 };

export interface Entitlements {
  tier: Tier | null; // active subscription
  myChart: boolean; // bought the one-time full reading
  peopleCredits: number; // extra people bought one by one
}
export const NO_ENTITLEMENTS: Entitlements = { tier: null, myChart: false, peopleCredits: 0 };

/** What each level unlocks. Gold = Silver + unlimited Ask. */
export function access(e: Entitlements, usage: { daysSinceStart: number; aiUsed: number; people: number }) {
  const sub = e.tier !== null;
  return {
    fullReading: sub || e.myChart,
    peopleFullReading: sub,
    dailyTips: sub || usage.daysSinceStart < FREE.tipDays,
    canAddPerson: sub || usage.people < FREE.people + e.peopleCredits,
    aiLeft: e.tier === 'gold' ? Infinity : Math.max(0, FREE.aiQuestions - usage.aiUsed),
  };
}
