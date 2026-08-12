import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GradientBackground, GoldButton, Card } from '../components/ui';
import { colors, spacing, radius, typography } from '../theme';
import { MOODS, PRAYER_FOCUS, PrayerMood, PrayerFocus } from '../data/prayers';
import { useStreak, useJournal, useHistory } from '../hooks/useStorage';
import { generatePrayer, GeneratedPrayer } from '../services/ai';
import * as Haptics from 'expo-haptics';

export default function PrayerScreen() {
  const params = useLocalSearchParams<{ mood?: string }>();
  const router = useRouter();

  const initialMood = MOODS.some((m) => m.id === params.mood) ? (params.mood as PrayerMood) : 'grateful';
  const [mood, setMood] = useState<PrayerMood>(initialMood);
  const [focus, setFocus] = useState<PrayerFocus>('self');
  const [name, setName] = useState('');
  const [prayer, setPrayer] = useState<GeneratedPrayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [completed, setCompleted] = useState(false);

  const { recordPrayer } = useStreak();
  const { addEntry } = useJournal();
  const { logPrayer } = useHistory();

  const generate = useCallback(async () => {
    setLoading(true);
    setPrayer(null);
    setCompleted(false);
    const result = await generatePrayer(mood, focus, name);
    setPrayer(result);
    setLoading(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, [mood, focus, name]);

  const complete = useCallback(async () => {
    await recordPrayer();
    await logPrayer(mood, focus);
    await addEntry({
      mood,
      text: journalText.trim() || prayer?.text || '',
      verse: prayer ? `${prayer.verse.reference}` : undefined,
      dateKey: new Date().toISOString().slice(0, 10),
    });
    setCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => router.back(), 1400);
  }, [recordPrayer, logPrayer, addEntry, mood, focus, journalText, prayer]);

  useEffect(() => {
    generate();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Time to Pray</Text>
            <Text style={styles.subtitle}>Pause. Center your heart. Talk to God.</Text>

            {/* Mood selection */}
            <Text style={styles.label}>How do you feel?</Text>
            <View style={styles.chipWrap}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    styles.chip,
                    { borderColor: mood === m.id ? colors.gold : colors.navyBorder },
                    mood === m.id && { backgroundColor: 'rgba(212,175,55,0.15)' },
                  ]}
                  onPress={() => setMood(m.id)}
                >
                  <Text style={styles.chipEmoji}>{m.emoji}</Text>
                  <Text style={[styles.chipLabel, mood === m.id && { color: colors.goldBright }]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Focus selection */}
            <Text style={styles.label}>Who are you praying for?</Text>
            <View style={styles.chipWrap}>
              {PRAYER_FOCUS.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.chip,
                    { borderColor: focus === f.id ? colors.gold : colors.navyBorder },
                    focus === f.id && { backgroundColor: 'rgba(212,175,55,0.15)' },
                  ]}
                  onPress={() => setFocus(f.id)}
                >
                  <Text style={styles.chipEmoji}>{f.emoji}</Text>
                  <Text style={[styles.chipLabel, focus === f.id && { color: colors.goldBright }]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Optional name */}
            <TextInput
              style={styles.input}
              placeholder="First name to personalize (optional)"
              placeholderTextColor={colors.ivoryDim}
              value={name}
              onChangeText={setName}
              maxLength={40}
            />

            <GoldButton title={prayer ? 'Regenerate' : 'Generate Prayer'} onPress={generate} loading={loading} style={{ marginTop: spacing.sm }} />

            {/* Prayer display */}
            {prayer && !loading && (
              <Card goldBorder style={styles.prayerCard}>
                <Text style={styles.prayerText}>{prayer.text}</Text>
                <Text style={styles.prayerVerse}>“{prayer.verse.text}”</Text>
                <Text style={styles.prayerRef}>— {prayer.verse.reference}</Text>
              </Card>
            )}

            {loading && (
              <Card style={styles.prayerCard}>
                <Text style={styles.loadingText}>Seeking the right words…</Text>
              </Card>
            )}

            {/* Journal reflection */}
            <Text style={styles.label}>Reflection (optional)</Text>
            <TextInput
              style={[styles.input, styles.journalInput]}
              placeholder="What's on your heart today?"
              placeholderTextColor={colors.ivoryDim}
              value={journalText}
              onChangeText={setJournalText}
              multiline
              maxLength={1000}
            />

            {prayer && !loading && (
              <GoldButton title={completed ? '✓ Thank you for praying' : 'I Prayed — Unlock'} onPress={complete} style={{ marginTop: spacing.sm }} disabled={completed} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 60 },
  header: { marginBottom: spacing.md },
  backBtn: { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { color: colors.gold, fontSize: 15, fontWeight: '600' },
  title: { ...typography.serif.heading, color: colors.ivory },
  subtitle: { ...typography.sans.body, color: colors.ivoryMuted, marginBottom: spacing.lg },
  label: { ...typography.sans.label, color: colors.goldBright, marginTop: spacing.md, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  chip: {
    width: '30%',
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  chipEmoji: { fontSize: 20 },
  chipLabel: { ...typography.sans.label, color: colors.ivoryMuted, marginTop: 2 },
  input: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    padding: spacing.md,
    color: colors.ivory,
    marginTop: spacing.sm,
    fontSize: 15,
  },
  journalInput: { minHeight: 90, textAlignVertical: 'top' },
  prayerCard: { marginTop: spacing.lg, backgroundColor: 'rgba(27,45,71,0.95)' },
  prayerText: { ...typography.serif.scriptureLarge, color: colors.ivory, textAlign: 'center', marginBottom: spacing.lg },
  prayerVerse: { ...typography.serif.scripture, color: colors.goldBright, textAlign: 'center', fontSize: 15, lineHeight: 24 },
  prayerRef: { ...typography.sans.caption, color: colors.ivoryDim, textAlign: 'center', marginTop: 4 },
  loadingText: { color: colors.ivoryMuted, textAlign: 'center', ...typography.sans.body },
});
