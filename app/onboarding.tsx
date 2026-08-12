import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { GradientBackground, GoldButton, Card } from '../components/ui';
import { colors, spacing, radius, typography } from '../theme';
import { useSettings } from '../hooks/useStorage';
import { syncBlockedApps } from '../services/blocker';
import * as Haptics from 'expo-haptics';

const STEPS = 4;

export default function Onboarding() {
  const router = useRouter();
  const { update } = useSettings();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [denomination, setDenomination] = useState('');
  const [blockedApps, setBlockedApps] = useState<string[]>([]);

  const denominations = ['Nondenominational', 'Catholic', 'Protestant', 'Evangelical', 'Orthodox', 'Prefer not to say'];
  const appOptions = ['TikTok', 'Instagram', 'YouTube', 'X / Twitter', 'Facebook', 'Games'];

  const toggleApp = (app: string) => {
    setBlockedApps((prev) => (prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]));
    Haptics.selectionAsync().catch(() => {});
  };

  const next = useCallback(async () => {
    if (step < STEPS - 1) {
      setStep(step + 1);
    } else {
      await update({ onBoarded: true, name: name.trim(), denomination, blockedApps });
      await syncBlockedApps(blockedApps);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      router.replace('/(tabs)');
    }
  }, [step, name, denomination, blockedApps]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Progress dots */}
            <View style={styles.dots}>
              {Array.from({ length: STEPS }).map((_, i) => (
                <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
              ))}
            </View>

            {step === 0 && (
              <View style={styles.center}>
                <Text style={styles.logo}>🙏</Text>
                <Text style={styles.welcome}>Welcome to FaithBlock</Text>
                <Text style={styles.welcomeSub}>
                  Before Instagram, TikTok, or games open — pause, pray, then unlock. Go from lukewarm to closer to God.
                </Text>
              </View>
            )}

            {step === 1 && (
              <View style={styles.center}>
                <Text style={styles.question}>What should we call you?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your first name"
                  placeholderTextColor={colors.ivoryDim}
                  value={name}
                  onChangeText={setName}
                  maxLength={30}
                  autoFocus
                />
              </View>
            )}

            {step === 2 && (
              <View style={styles.center}>
                <Text style={styles.question}>Your faith tradition?</Text>
                <View style={styles.optionWrap}>
                  {denominations.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.option, denomination === d && styles.optionActive]}
                      onPress={() => setDenomination(d)}
                    >
                      <Text style={[styles.optionText, denomination === d && styles.optionTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.center}>
                <Text style={styles.question}>Which apps distract you most?</Text>
                <Text style={styles.questionSub}>We'll pause them until you pray. You can change this anytime.</Text>
                <View style={styles.optionWrap}>
                  {appOptions.map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={[styles.option, blockedApps.includes(a) && styles.optionActive]}
                      onPress={() => toggleApp(a)}
                    >
                      <Text style={[styles.optionText, blockedApps.includes(a) && styles.optionTextActive]}>{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <GoldButton
              title={step === 0 ? 'Get Started' : step === STEPS - 1 ? 'Finish' : 'Continue'}
              onPress={next}
              style={{ marginTop: spacing.xl }}
              disabled={step === 1 && !name.trim()}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.navyBorder, marginHorizontal: 4 },
  dotActive: { backgroundColor: colors.gold, width: 24 },
  center: { alignItems: 'center', marginBottom: spacing.md },
  logo: { fontSize: 64, marginBottom: spacing.md },
  welcome: { ...typography.serif.heading, color: colors.ivory, textAlign: 'center', marginBottom: spacing.sm },
  welcomeSub: { ...typography.sans.body, color: colors.ivoryMuted, textAlign: 'center', lineHeight: 24 },
  question: { ...typography.serif.subheading, color: colors.ivory, textAlign: 'center', marginBottom: spacing.sm },
  questionSub: { ...typography.sans.body, color: colors.ivoryMuted, textAlign: 'center', marginBottom: spacing.md },
  input: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    padding: spacing.md,
    color: colors.ivory,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
  },
  optionWrap: { width: '100%' },
  option: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.navyBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  optionActive: { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.12)' },
  optionText: { color: colors.ivory, fontSize: 16, fontWeight: '500' },
  optionTextActive: { color: colors.goldBright, fontWeight: '700' },
});
