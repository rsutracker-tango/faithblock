import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground, GoldButton, Card, ScriptureCard, SectionHeader } from '../../components/ui';
import { colors, spacing, radius, typography } from '../../theme';
import { generateDevotional, Devotional } from '../../services/ai';
import { dayKey } from '../../hooks/useStorage';
import { usePremium } from '../../hooks/useStorage';
import { useRouter } from 'expo-router';

export default function DevotionalScreen() {
  const router = useRouter();
  const { premium } = usePremium();
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);
  const [day] = useState(() => parseInt(dayKey().replace(/-/g, ''), 10));

  const load = useCallback(async () => {
    setLoading(true);
    const result = await generateDevotional(day);
    setDevotional(result);
    setLoading(false);
  }, [day]);

  useEffect(() => {
    load();
  }, [load]);

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.date}>{dateStr}</Text>
          <Text style={styles.title}>Daily Devotional</Text>

          {!premium && (
            <Card style={styles.paywallBanner}>
              <Text style={styles.paywallTitle}>âœ¨ Premium Devotionals</Text>
              <Text style={styles.paywallSub}>This is a preview. Unlock unlimited devotionals, full journal history, and all prayer moods.</Text>
              <GoldButton title="Go Premium" onPress={() => router.push('/paywall')} style={{ marginTop: spacing.sm }} />
            </Card>
          )}

          {loading && (
            <Card>
              <Text style={styles.loadingText}>Preparing today's devotionalâ€¦</Text>
            </Card>
          )}

          {devotional && !loading && (
            <>
              <SectionHeader title={devotional.title} />
              <ScriptureCard text={devotional.verse.text} reference={devotional.verse.reference} />

              <Card>
                <Text style={styles.sectionLabel}>Reading</Text>
                <Text style={styles.body}>{devotional.reading}</Text>
              </Card>

              <Card>
                <Text style={styles.sectionLabel}>Reflection</Text>
                {devotional.reflection.split('\n').filter(Boolean).map((q, i) => (
                  <Text key={i} style={styles.body}>â€¢ {q}</Text>
                ))}
              </Card>

              <Card goldBorder>
                <Text style={styles.sectionLabel}>Prayer</Text>
                <Text style={styles.prayerText}>{devotional.prayer}</Text>
              </Card>

              <Card>
                <Text style={styles.sectionLabel}>Today's Challenge</Text>
                <Text style={styles.body}>ðŸŒ± {devotional.challenge}</Text>
              </Card>

              <GoldButton title="Mark as Read" onPress={() => router.push('/prayer')} style={{ marginBottom: spacing.lg }} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  date: { ...typography.sans.label, color: colors.goldBright, textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { ...typography.serif.heading, color: colors.ivory, marginBottom: spacing.lg },
  loadingText: { color: colors.ivoryMuted, textAlign: 'center' },
  sectionLabel: { ...typography.sans.label, color: colors.goldBright, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  body: { ...typography.sans.body, color: colors.ivory, lineHeight: 24, marginBottom: spacing.xs },
  prayerText: { ...typography.serif.scripture, color: colors.ivory, lineHeight: 28 },
  paywallBanner: { backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1, borderColor: colors.goldSoft },
  paywallTitle: { ...typography.sans.title, color: colors.goldBright },
  paywallSub: { ...typography.sans.body, color: colors.ivoryMuted, marginTop: spacing.xs },
});
