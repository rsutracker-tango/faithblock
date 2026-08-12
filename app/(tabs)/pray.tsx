import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground, Card, ScriptureCard } from '../../components/ui';
import { colors, spacing, radius, typography } from '../../theme';
import { MOODS } from '../../data/prayers';
import { getVerseOfDay } from '../../data/bible';
import { dayKey } from '../../hooks/useStorage';

export default function PrayHub() {
  const router = useRouter();
  const verse = getVerseOfDay(parseInt(dayKey().replace(/-/g, ''), 10) % 365);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Pray</Text>
          <Text style={styles.subtitle}>"Be still, and know that I am God." â€” Psalm 46:10</Text>

          <ScriptureCard text={verse.text} reference={verse.reference} />

          <Text style={styles.sectionLabel}>Choose how you're feeling</Text>
          <View style={styles.grid}>
            {MOODS.map((m) => (
              <TouchableOpacity key={m.id} style={styles.gridItem} onPress={() => router.push(`/prayer?mood=${m.id}`)}>
                <Text style={styles.gridEmoji}>{m.emoji}</Text>
                <Text style={styles.gridLabel}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why FaithBlock?</Text>
            <Text style={styles.infoText}>
              Before you scroll, you pause and pray. Small pauses, daily, grow into a closer walk with God. Your streaks keep you faithful â€” and your
              journal becomes a record of His faithfulness.
            </Text>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  title: { ...typography.serif.heading, color: colors.ivory },
  subtitle: { ...typography.sans.body, color: colors.ivoryMuted, marginBottom: spacing.lg },
  sectionLabel: { ...typography.sans.label, color: colors.goldBright, textTransform: 'uppercase', letterSpacing: 1, marginTop: spacing.lg, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: {
    width: '30%',
    backgroundColor: colors.navyCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  gridEmoji: { fontSize: 28, marginBottom: spacing.sm },
  gridLabel: { ...typography.sans.label, color: colors.ivory },
  infoCard: { backgroundColor: 'rgba(27,45,71,0.8)', marginTop: spacing.md },
  infoTitle: { ...typography.serif.subheading, color: colors.goldBright, marginBottom: spacing.sm },
  infoText: { ...typography.sans.body, color: colors.ivoryMuted, lineHeight: 24 },
});
