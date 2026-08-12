import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground, GoldButton, Card } from '../../components/ui';
import { colors, spacing, radius, typography } from '../../theme';
import { useJournal, usePremium } from '../../hooks/useStorage';
import { MOODS } from '../../data/prayers';
import { dayKey } from '../../hooks/useStorage';

export default function JournalScreen() {
  const router = useRouter();
  const { entries, addEntry, deleteEntry } = useJournal();
  const { premium } = usePremium();

  const [text, setText] = useState('');
  const [mood, setMood] = useState('grateful');
  const [composing, setComposing] = useState(false);

  const save = useCallback(async () => {
    if (!text.trim()) return;
    await addEntry({ mood, text: text.trim(), dateKey: dayKey() });
    setText('');
    setMood('grateful');
    setComposing(false);
  }, [text, mood, addEntry]);

  const maxFreeEntries = 3;
  const visibleEntries = premium ? entries : entries.slice(0, maxFreeEntries);

  const moodEmoji = (id: string) => MOODS.find((m) => m.id === id)?.emoji || 'ðŸ™';
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Prayer Journal</Text>
          <Text style={styles.subtitle}>A sacred record of your conversations with God.</Text>

          {!premium && (
            <Card style={styles.paywallBanner}>
              <Text style={styles.paywallText}>Free plan keeps your last {maxFreeEntries} entries. <Text onPress={() => router.push('/paywall')} style={styles.paywallLink}>Go Premium â†’</Text></Text>
            </Card>
          )}

          {!composing ? (
            <GoldButton title="âœï¸ Write an Entry" onPress={() => setComposing(true)} style={{ marginVertical: spacing.md }} />
          ) : (
            <Card goldBorder>
              <Text style={styles.label}>How are you feeling?</Text>
              <View style={styles.chipWrap}>
                {MOODS.slice(0, 6).map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.chip, mood === m.id && { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.15)' }]}
                    onPress={() => setMood(m.id)}
                  >
                    <Text style={styles.chipEmoji}>{m.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Write your heart outâ€¦"
                placeholderTextColor={colors.ivoryDim}
                value={text}
                onChangeText={setText}
                multiline
                maxLength={2000}
                autoFocus
              />
              <GoldButton title="Save Entry" onPress={save} disabled={!text.trim()} />
            </Card>
          )}

          {visibleEntries.length === 0 && (
            <Card>
              <Text style={styles.emptyText}>No entries yet. Start your prayer journal today â€” it's a beautiful habit.</Text>
            </Card>
          )}

          {visibleEntries.map((entry) => (
            <Card key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryMood}>{moodEmoji(entry.mood)}</Text>
                <Text style={styles.entryDate}>{fmtDate(entry.date)}</Text>
                <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
                  <Text style={styles.deleteText}>âœ•</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.entryText}>{entry.text}</Text>
              {entry.verse && <Text style={styles.entryVerse}>â€¢ {entry.verse}</Text>}
            </Card>
          ))}

          {!premium && entries.length > maxFreeEntries && (
            <TouchableOpacity onPress={() => router.push('/paywall')} style={styles.unlockBtn}>
              <Text style={styles.unlockText}>Unlock all {entries.length} entries with Premium â†’</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  title: { ...typography.serif.heading, color: colors.ivory },
  subtitle: { ...typography.sans.body, color: colors.ivoryMuted, marginBottom: spacing.sm },
  label: { ...typography.sans.label, color: colors.goldBright, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.sm },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    backgroundColor: colors.navyCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  chipEmoji: { fontSize: 20 },
  input: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    padding: spacing.md,
    color: colors.ivory,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
    fontSize: 15,
  },
  entryCard: { backgroundColor: 'rgba(27,45,71,0.9)' },
  entryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  entryMood: { fontSize: 18, marginRight: spacing.sm },
  entryDate: { ...typography.sans.caption, color: colors.ivoryDim, flex: 1 },
  deleteText: { color: colors.danger, fontSize: 16 },
  entryText: { ...typography.sans.body, color: colors.ivory, lineHeight: 24 },
  entryVerse: { ...typography.serif.scripture, color: colors.goldBright, fontSize: 14, marginTop: spacing.sm, lineHeight: 20 },
  emptyText: { color: colors.ivoryMuted, textAlign: 'center', ...typography.sans.body },
  paywallBanner: { backgroundColor: 'rgba(212,175,55,0.08)', borderWidth: 1, borderColor: colors.goldSoft },
  paywallText: { color: colors.ivoryMuted, ...typography.sans.body },
  paywallLink: { color: colors.goldBright, fontWeight: '700' },
  unlockBtn: { alignItems: 'center', padding: spacing.md },
  unlockText: { ...typography.sans.caption, color: colors.gold, fontWeight: '700' },
});
