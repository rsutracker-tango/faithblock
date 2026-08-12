import { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground, GoldButton, Card, StreakRing, ScriptureCard, SectionHeader } from '../../components/ui';
import { colors, spacing, radius, typography } from '../../theme';
import { useStreak, useSettings, dayKey } from '../../hooks/useStorage';
import { getVerseOfDay } from '../../data/bible';
import { MOODS } from '../../data/prayers';

export default function HomeScreen() {
  const router = useRouter();
  const { streak, recordPrayer } = useStreak();
  const { settings } = useSettings();

  const verse = useMemo(() => getVerseOfDay(parseInt(dayKey().replace(/-/g, ''), 10) % 365), []);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const quickPray = useCallback(() => {
    router.push('/prayer');
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{greet()},</Text>
              <Text style={styles.name}>{settings.name || 'Beloved'}</Text>
            </View>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => router.push('/settings')}>
              <Text style={styles.settingsIcon}>âš™ï¸</Text>
            </TouchableOpacity>
          </View>

          {/* Streak ring */}
          <View style={styles.streakSection}>
            <StreakRing streak={streak.current} />
            <Text style={styles.streakSub}>
              {streak.lastPrayedDay === dayKey() ? 'You prayed today â€” keep going!' : `Pray today to keep your streak alive`}
            </Text>
          </View>

          {/* Verse of the day */}
          <SectionHeader title="Verse of the Day" />
          <ScriptureCard text={verse.text} reference={verse.reference} />

          {/* Quick pray CTA */}
          <Card goldBorder style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Feeling called to pray?</Text>
            <Text style={styles.ctaSub}>Pause the scroll. Center your heart. Talk to God.</Text>
            <GoldButton title="Start Prayer" onPress={quickPray} style={{ marginTop: spacing.md }} />
          </Card>

          {/* Mood quick-pray chips */}
          <SectionHeader title="How are you feeling?" />
          <View style={styles.moodGrid}>
            {MOODS.slice(0, 6).map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodChip, { borderColor: mood.color }]}
                onPress={() => router.push(`/prayer?mood=${mood.id}`)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { ...typography.sans.body, color: colors.ivoryMuted },
  name: { ...typography.serif.heading, color: colors.ivory, marginTop: 2 },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.navyCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.navyBorder,
  },
  settingsIcon: { fontSize: 20 },
  streakSection: { alignItems: 'center', marginBottom: spacing.md },
  streakSub: { ...typography.sans.body, color: colors.ivoryMuted, marginTop: spacing.md, textAlign: 'center' },
  ctaCard: { backgroundColor: 'rgba(212,175,55,0.08)' },
  ctaTitle: { ...typography.serif.subheading, color: colors.goldBright },
  ctaSub: { ...typography.sans.body, color: colors.ivoryMuted, marginTop: spacing.xs },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodChip: {
    width: '31%',
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  moodEmoji: { fontSize: 24, marginBottom: 4 },
  moodLabel: { ...typography.sans.label, color: colors.ivoryMuted },
});
