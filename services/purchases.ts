// FaithBlock RevenueCat integration - real in-app purchases
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, CustomerInfo, PurchasesPackage, PurchasesConfiguration } from 'react-native-purchases';

/**
 * STEP 1: These are RevenueCat SDK keys.
 *  - Current values: TEST keys (sandbox). Works for testing in a dev build
 *    with a StoreKit sandbox / Play billing test account.
 *  - Before launch, replace with your PRODUCTION keys:
 *    app.revenuecat.com -> Project Settings -> API Keys -> Production
 *    (Android: "goog_..."  iOS: "appl_...")
 *  - Expo Go only supports a dummy key; real payments need a dev build.
 */
export const REVENUECAT_ANDROID_KEY = 'test_aCpPwbqBigsEFIsiwWkPujmjEOE';
export const REVENUECAT_IOS_KEY = 'test_aCpPwbqBigsEFIsiwWkPujmjEOE';

/** MUST match the entitlement you create in the RevenueCat dashboard. */
export const ENTITLEMENT_ID = 'premium';

/** Call once at app startup (in root layout) before rendering paywalled UI. */
export async function configureRevenueCat(): Promise<void> {
  try {
    const key = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
    await Purchases.setLogLevel(LOG_LEVEL.INFO);

    const configuration: PurchasesConfiguration = {
      apiKey: key,
      appUserID: null,
    };
    Purchases.configure(configuration);
  } catch (e) {
    console.warn('RevenueCat configure failed (payments disabled in preview)', e);
  }
}

/** Refresh entitlement state. Returns true when the user has "premium". */
export async function checkPremium(): Promise<boolean> {
  try {
    const info: CustomerInfo = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('checkPremium failed', e);
    return false;
  }
}

/** Fetch the offering packages to present in the paywall. */
export async function getOfferings(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  } catch (e) {
    console.warn('getOfferings failed', e);
    return [];
  }
}

/** Purchase a package. Returns true on success. */
export async function purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e: any) {
    // e.userCancelled -> user backed out; not an error worth surfacing.
    console.warn('purchase failed', e?.userCancelled ? 'cancelled' : e);
    return false;
  }
}

/** Restore previous purchases (must be exposed in the paywall). */
export async function restorePurchases(): Promise<boolean> {
  try {
    const info: CustomerInfo = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    console.warn('restore failed', e);
    return false;
  }
}
