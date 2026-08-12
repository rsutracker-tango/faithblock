import { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GoldButton } from '../components/ui';
import { colors, spacing, radius, typography } from '../theme';
import { usePremium } from '../hooks/useStorage';
import { getOfferings, purchasePackage, restorePurchases } from '../services/purchases';
import { PurchasesPackage } from 'react-native-purchases';
import * as Haptics from 'expo-haptics';

const FEATURES = [
  'Block unlimited apps until you pray',
  'Unlimited AI-generated prayers',
  'Full daily devotional library',
  'Unlimited prayer journal history',
  'All 10 prayer moods + pray for others',
  'Weekly prayer recap & insights',
  'Morning routine mode',
];

export default function Paywall() {
  const router = useRouter();
  const { unlock } = usePremium();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selected, setSelected] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    (async () => {
      const pkgs = await getOfferings();
      setPackages(pkgs);
      if (pkgs.length) {
        // Prefer the annual package (best value), fall back to first.
        const annual = pkgs.find((p) => p.packageType === 'ANNUAL') || pkgs[0];
        setSelected(annual);
      }
      setLoading(false);
    })();
  }, []);

  const subscribe = useCallback(async () => {
    if (!selected || buying) return;
    setBuying(true);
    const ok = await purchasePackage(selected);
    setBuying(false);
    if (ok) {
      await unlock();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    }
  }, [selected, buying, unlock]);

  const restore = useCallback(async () => {
    const ok = await restorePurchases();
    if (ok) {
      await unlock();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.back();
    }
  }, [unlock]);

  const fallbackPlans = [
    { id: 'week', label: 'Weekly', price: '$4.99', per: 'per week', save: '' },
    { id: 'year', label: 'Yearly', price: '$29.99', per: 'per year', save: 'Save 88%' },
    { id: 'lifetime', label: 'Lifetime', price: '$49.99', per: 'one time', save: 'Best value' },
  ];

  const displayPlans = packages.length
    ? packages.map((p) => ({
        id: p.identifier,
        label: p.packageType === 'ANNUAL' ? 'Yearly' : p.packageType === 'LIFETIME' ? 'Lifetime' : 'Weekly',
        price: p.product.priceString,
        per: p.packageType === 'ANNUAL' ? 'per year' : p.packageType === 'LIFETIME' ? 'one time' : 'per week',
        save: p.packageType === 'ANNUAL' ? 'Save 88%' : p.packageType === 'LIFETIME' ? 'Best value' : '',
        pkg: p,
      }))
    : fallbackPlans.map((p) => ({ ...p, pkg: null }));

  const chosen = selected
    ? displayPlans.find((p) => p.pkg?.identifier === selected.identifier)
    : displayPlans[0];

  return (
    <LinearGradient colors={[...colors.gradientSunset]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.back()} style={styles.close}>
            <Text style={styles.closeText}>âœ•</Text>
          </TouchableOpacity>

          <Text style={styles.emoji}>ðŸ™</Text>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>Keep your heart closer to God, every day.</Text>

          <View style={styles.features}>
            {FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.check}>âœ“</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.gold} size="large" />
              <Text style={styles.loadingText}>Loading plansâ€¦</Text>
            </View>
          ) : (
            <View style={styles.planRow}>
              {displayPlans.slice(0, 3).map((p) => {
                const active = selected && p.pkg ? selected.identifier === p.pkg.identifier : false;
                return (
                  <TouchableOpacity key={p.id} style={[styles.plan, active && styles.planActive]} onPress={() => p.pkg && setSelected(p.pkg)}>
                    {p.save ? (
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveText}>{p.save}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.planPrice}>{p.price}</Text>
                    <Text style={styles.planPer}>{p.per}</Text>
                    <Text style={[styles.planLabel, active && { color: colors.goldBright }]}>{p.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <GoldButton
            title={buying ? 'Processingâ€¦' : `Continue â€” ${chosen?.price ?? '$29.99'}`}
            onPress={subscribe}
            loading={buying}
            disabled={!selected}
            style={{ marginTop: spacing.lg }}
          />
          <TouchableOpacity onPress={restore} style={styles.restoreBtn}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
          <Text style={styles.terms}>
            Cancel anytime. Subscriptions auto-renew. {packages.length ? 'Powered by RevenueCat â€” charged via Google Play / App Store.' : 'Payments are not yet wired to the stores â€” this is a demo paywall.'}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: spacing.xl },
  close: { alignSelf: 'flex-end', width: 40, height: 40, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.ivory, fontSize: 18 },
  emoji: { fontSize: 56, textAlign: 'center', marginVertical: spacing.md },
  title: { ...typography.serif.heading, color: colors.ivory, textAlign: 'center' },
  subtitle: { ...typography.sans.body, color: colors.ivoryMuted, textAlign: 'center', marginBottom: spacing.lg },
  features: { marginBottom: spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  check: { color: colors.goldBright, fontSize: 16, fontWeight: '800', marginRight: spacing.sm },
  featureText: { color: colors.ivory, ...typography.sans.body, flex: 1 },
  loadingBox: { alignItems: 'center', padding: spacing.xl },
  loadingText: { color: colors.ivoryMuted, marginTop: spacing.sm },
  planRow: { flexDirection: 'row', justifyContent: 'space-between' },
  plan: {
    width: '31%',
    backgroundColor: 'rgba(15,27,45,0.7)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    padding: spacing.md,
    alignItems: 'center',
  },
  planActive: { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.12)' },
  saveBadge: { position: 'absolute', top: -10, backgroundColor: colors.gold, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  saveText: { color: colors.navyDeep, fontSize: 10, fontWeight: '800' },
  planPrice: { ...typography.serif.subheading, color: colors.ivory, marginTop: spacing.sm },
  planPer: { ...typography.sans.caption, color: colors.ivoryDim },
  planLabel: { ...typography.sans.label, color: colors.ivoryMuted, marginTop: 4 },
  restoreBtn: { alignItems: 'center', padding: spacing.md, marginTop: spacing.sm },
  restoreText: { color: colors.ivoryMuted, textDecorationLine: 'underline' },
  terms: { ...typography.sans.caption, color: colors.ivoryDim, textAlign: 'center', marginTop: spacing.xs, lineHeight: 18 },
});
