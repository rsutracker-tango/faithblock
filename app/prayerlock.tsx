import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AppState, BackHandler, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GoldButton, Card, StreakRing } from '../components/ui';
import { colors, spacing, radius, typography } from '../theme';
import { useStreak, useJournal } from '../hooks/useStorage';
import { usePremium } from '../hooks/useStorage';
import { appNameForPackage } from '../services/blocker';
import * as Haptics from 'expo-haptics';

const FALLBACK_PRAYER =
  'Heavenly Father, I was reaching for a distraction, but You have called me to pause. Thank You for this moment of stillness. Steady my heart, quiet my mind, and help me release what I do not need. I place this moment, and this day, into Your hands. Guide me, strengthen me, and help me to love as You love. In Jesus\u2019 name, Amen.';

const FALLBACK_VERSE = { text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.', reference: 'Psalm 46:10' };

export default function PrayerLockRoute() {
  const params = useLocalSearchParams<{ package?: string }>();
  const router = useRouter();
  const { streak, recordPrayer } = useStreak();
  const { addEntry } = useJournal();
  const { premium } = usePremium();

  const [prayed, setPrayed] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [readyToUnlock, setReadyToUnlock] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const blockedAppName = params.package ? appNameForPackage(params.package) || 'that app' : 'that app';

  // Simple breathing/pause timer before unlock is granted.
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s >= 14) {
          if (timerRef.current) clearInterval(timerRef.current);
          setReadyToUnlock(true);
          return 14;
        }
        return s + 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Block back button — the user must pray, not escape.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        // User left the prayer screen without praying - nothing to record.
      }
    });
    return () => sub.remove();
  }, []);

  const handlePrayed = useCallback(async () => {
    if (prayed) return;
    await recordPrayer();
    await addEntry({
      mood: 'peaceful',
      text: `Paused before opening ${blockedAppName} and turned my heart to God.`,
      verse: FALLBACK_VERSE.reference,
      dateKey: new Date().toISOString().slice(0, 10),
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPrayed(true);
  }, [prayed, recordPrayer, addEntry, blockedAppName]);

  const unlock = useCallback(() => {
    router.dismissAll();
    router.replace('/(tabs)');
  }, [router]);

  const restartTimer = useCallback(() => {
    setSeconds(0);
    setReadyToUnlock(false);
    setPrayed(false);
  }, []);

  return (
    <LinearGradient colors={[...colors.gradientDawn]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PAUSE & PRAY</Text>
          <Text style={styles.title}>Before {blockedAppName}…</Text>
        </View>

        <View style={styles.center}>
          <Text style={styles.verse}>“{FALLBACK_VERSE.text}”</Text>
          <Text style={styles.verseRef}>— {FALLBACK_VERSE.reference}</Text>
        </View>

        <Card style={styles.prayerCard}>
          <Text style={styles.prayerText}>{FALLBACK_PRAYER}</Text>
        </Card>

        {!prayed ? (
          <GoldButton title="🙏 I Prayed" onPress={handlePrayed} style={{ marginTop: spacing.lg }} />
        ) : (
          <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
            <StreakRing streak={streak.current} size={100} strokeWidth={7} />
            <Text style={styles.streakText}>Day {streak.current} — keep it going!</Text>
            <Text style={styles.timerText}>
              {readyToUnlock ? 'You have earned a few mindful seconds. Breathe deep…' : `Breathing pause… ${Math.max(0, 14 - seconds)}s`}
            </Text>
            {readyToUnlock ? (
              <GoldButton title={premium ? 'Open My App' : 'Open My App'} onPress={unlock} style={{ marginTop: spacing.md, width: '70%' }} />
            ) : (
              <TouchableOpacity onPress={restartTimer} style={{ marginTop: spacing.md, padding: spacing.sm }}>
                <Text style={styles.restartText}>Start over</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={styles.footer}>Small pauses, daily, grow a closer walk with God.</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  header: { alignItems: 'center' },
  eyebrow: { ...typography.sans.label, color: colors.goldBright, textTransform: 'uppercase', letterSpacing: 3 },
  title: { ...typography.serif.heading, color: colors.ivory, textAlign: 'center', marginTop: spacing.sm },
  center: { alignItems: 'center', marginVertical: spacing.lg },
  verse: { ...typography.serif.scriptureLarge, color: colors.goldBright, textAlign: 'center', lineHeight: 32 },
  verseRef: { ...typography.sans.caption, color: colors.ivoryMuted, marginTop: spacing.sm, letterSpacing: 1 },
  prayerCard: { backgroundColor: 'rgba(27,45,71,0.9)' },
  prayerText: { ...typography.serif.scripture, color: colors.ivory, textAlign: 'center', lineHeight: 28 },
  streakText: { ...typography.sans.title, color: colors.goldBright, marginTop: spacing.sm },
  timerText: { ...typography.sans.body, color: colors.ivoryMuted, marginTop: spacing.sm, textAlign: 'center' },
  restartText: { color: colors.ivoryDim, textDecorationLine: 'underline' },
  footer: { ...typography.sans.caption, color: colors.ivoryDim, textAlign: 'center', marginBottom: spacing.sm },
});
