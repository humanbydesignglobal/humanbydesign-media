// In-app purchases through RevenueCat (handles Apple + Google receipts, renewals,
// refunds and restore). Until the RevenueCat keys are added to app.json
// ("extra.revenuecat"), the store runs in preview mode: prices show in USD and,
// in development builds only, purchases unlock locally so every screen can be tested.
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesStoreProduct } from 'react-native-purchases';
import { NO_ENTITLEMENTS, PRODUCTS, type Entitlements, type ProductKey } from './plans';

type Keys = { ios?: string; android?: string };
const keys = ((Constants.expoConfig?.extra as { revenuecat?: Keys } | undefined)?.revenuecat ?? {}) as Keys;
const apiKey = Platform.OS === 'ios' ? keys.ios : Platform.OS === 'android' ? keys.android : undefined;

export const storeConnected = !!apiKey;
export const previewPurchases = !storeConnected && __DEV__;

let configured = false;
let products: Partial<Record<ProductKey, PurchasesStoreProduct>> = {};
let trialOk: Partial<Record<ProductKey, boolean>> = {};

function toEntitlements(info: CustomerInfo): Entitlements {
  const active = info.entitlements.active;
  const tier = active.gold ? 'gold' : active.silver ? 'silver' : null;
  return {
    tier,
    myChart: info.allPurchasedProductIdentifiers.includes(PRODUCTS.my_chart.id),
    peopleCredits: info.nonSubscriptionTransactions.filter((t) => t.productIdentifier === PRODUCTS.my_people.id).length,
  };
}

export async function initStore(): Promise<Entitlements> {
  if (!apiKey) return NO_ENTITLEMENTS;
  try {
    if (!configured) {
      Purchases.configure({ apiKey });
      configured = true;
    }
    const list = await Purchases.getProducts(Object.values(PRODUCTS).map((p) => p.id));
    products = {};
    (Object.keys(PRODUCTS) as ProductKey[]).forEach((k) => {
      const hit = list.find((x) => x.identifier === PRODUCTS[k].id);
      if (hit) products[k] = hit;
    });
    trialOk = {};
    try {
      const subs = (Object.keys(products) as ProductKey[]).filter((k) => products[k]?.introPrice?.price === 0);
      if (subs.length) {
        const el = await Purchases.checkTrialOrIntroductoryPriceEligibility(subs.map((k) => PRODUCTS[k].id));
        subs.forEach((k) => {
          trialOk[k] = el[PRODUCTS[k].id]?.status === Purchases.INTRO_ELIGIBILITY_STATUS.INTRO_ELIGIBILITY_STATUS_ELIGIBLE;
        });
      }
    } catch {
      trialOk = {};
    }
    return toEntitlements(await Purchases.getCustomerInfo());
  } catch {
    return NO_ENTITLEMENTS;
  }
}

export function priceOf(k: ProductKey) {
  return products[k]?.priceString ?? PRODUCTS[k].usd;
}

// Free first week (set in App Store Connect). Only shown to people Apple says can still get it.
export function hasFreeTrial(k: ProductKey) {
  return !!trialOk[k];
}

export type BuyResult = { ok: true; ent?: Entitlements } | { ok: false; cancelled?: boolean; unavailable?: boolean };

export async function buy(k: ProductKey): Promise<BuyResult> {
  if (!apiKey) return previewPurchases ? { ok: true } : { ok: false, unavailable: true };
  const product = products[k];
  if (!product) return { ok: false, unavailable: true };
  try {
    const r = await Purchases.purchaseStoreProduct(product);
    return { ok: true, ent: toEntitlements(r.customerInfo) };
  } catch (e) {
    return { ok: false, cancelled: !!(e as { userCancelled?: boolean }).userCancelled };
  }
}

export async function restore(): Promise<Entitlements | null> {
  if (!apiKey) return null;
  try {
    return toEntitlements(await Purchases.restorePurchases());
  } catch {
    return null;
  }
}
