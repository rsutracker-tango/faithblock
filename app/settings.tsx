import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground, GoldButton, Card, SectionHeader } from '../components/ui';
import { colors, spacing, radius, typography } from '../theme';
import { useSettings, usePremium, useStreak } from '../hooks/useStorage';
import { syncBlockedApps, APP_CATALOG } from '../services/blocker';
import { useEffect, useCallback } from 'react';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, update } = useSettings();
  const { premium, unlock } = usePremium();
  const { streak } = useStreak();

  const syncToNative = useCallback(
    async (apps: string[]) => {
      await update({ blockedApps: apps });
      await syncBlockedApps(apps);
    },
    [update],
  );

  // Keep native in sync on mount (after onboarding / reload).
  useEffect(() => {
    syncBlockedApps(settings.blockedApps);
  }, []);

  const appOptions = APP_CATALOG.map((a) => a.name);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Premium status */}
          <Card goldBorder style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>{premium ? '👑 Premium Active' : '✨ Premium'}</Text>
            <Text style={styles.premiumSub}>
              {premium ? 'Thank you for supporting this journey.' : 'Unlock everything for $29.99/year.'}
            </Text>
            {!premium && <GoldButton title="Go Premium" onPress={() => router.push('/paywall')} style={{ marginTop: spacing.sm }} />}
          </Card>

          {/* Stats */}
          <SectionHeader title="Your Journey" />
          <View style={styles.statRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{streak.current}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{streak.best}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{streak.total}</Text>
              <Text style={styles.statLabel}>Total Prayers</Text>
            </View>
          </View>

          {/* Blocked apps */}
          <SectionHeader title="Blocked Apps" />
          <Card>
            <Text style={styles.cardSub}>Choose apps to pause until you pray.</Text>
            {Platform.OS === 'android' && (
              <View style={[styles.accessibilityBox, { marginBottom: spacing.md }]}>
                <Text style={styles.accessibilityTitle}>🔒 Prayer Lock service</Text>
                <Text style={styles.cardSub}>
                  To block apps on Android, enable FaithBlock's accessibility service. We only read the name of the app you open — never your content.
                </Text>
                <GoldButton
                  title="Open Accessibility Settings"
                  onPress={() => {
                    const { Linking } = require('react-native');
                    if (Platform.OS === 'android') {
                      Linking.sendIntent('android.settings.ACCESSIBILITY_SETTINGS').catch(() => Linking.openSettings());
                    } else {
                      Linking.openSettings();
                    }
                  }}
                  style={{ marginTop: spacing.sm }}
                />
              </View>
            )}
            {appOptions.map((app) => {
              const on = settings.blockedApps.includes(app);
              return (
                <View key={app} style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{app}</Text>
                  <Switch
                    value={on}
                    onValueChange={(val) => {
                      const next = val
                        ? [...settings.blockedApps, app]
                        : settings.blockedApps.filter((a) => a !== app);
                      syncToNative(next);
                    }}
                    trackColor={{ true: colors.gold, false: colors.navyBorder }}
                    thumbColor={on ? colors.goldBright : colors.ivoryDim}
                  />
                </View>
              );
            })}
          </Card>

          {/* Reminder */}
          <SectionHeader title="Reminders" />
          <Card>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Morning prayer reminder</Text>
                <Text style={styles.cardSub}>Start your day centered.</Text>
              </View>
              <Switch
                value={settings.notified || false}
                onValueChange={(val) => update({ notified: val })}
                trackColor={{ true: colors.gold, false: colors.navyBorder }}
                thumbColor={settings.notified ? colors.goldBright : colors.ivoryDim}
              />
            </View>
          </Card>

          <GoldButton title="Start a Prayer" onPress={() => router.push('/prayer')} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.serif.heading, color: colors.ivory },
  closeBtn: { width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.navyCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.navyBorder },
  closeText: { color: colors.ivory, fontSize: 18 },
  premiumCard: { backgroundColor: 'rgba(212,175,55,0.08)' },
  premiumTitle: { ...typography.sans.title, color: colors.goldBright },
  premiumSub: { ...typography.sans.body, color: colors.ivoryMuted, marginTop: 4 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { flex: 1, backgroundColor: colors.navyCard, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginHorizontal: 4 },
  statNum: { ...typography.serif.subheading, color: colors.goldBright },
  statLabel: { ...typography.sans.caption, color: colors.ivoryDim, marginTop: 2 },
  cardSub: { ...typography.sans.caption, color: colors.ivoryDim, marginBottom: spacing.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.navyBorder },
  switchLabel: { color: colors.ivory, fontSize: 15, flex: 1 },
  accessibilityBox: {
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.goldSoft,
    padding: spacing.md,
  },
  accessibilityTitle: { color: colors.goldBright, fontSize: 15, fontWeight: '700', marginBottom: 4 },
});
