// FaithBlock reusable UI components
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, radius, shadows, typography } from '../theme';

// ---------- GradientBackground ----------
export function GradientBackground({ children, variant = 'dawn', style }: { children: React.ReactNode; variant?: 'dawn' | 'sunset'; style?: StyleProp<ViewStyle> }) {
  const stops = variant === 'sunset' ? colors.gradientSunset : colors.gradientDawn;
  return (
    <LinearGradient colors={[...stops]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
}

// ---------- GoldButton ----------
interface GoldButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'gold' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export function GoldButton({ title, onPress, loading, variant = 'gold', style, disabled }: GoldButtonProps) {
  const bg = variant === 'gold' ? colors.gradientGold : undefined;
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[style, { opacity: disabled || loading ? 0.6 : 1 }]}
    >
      {bg ? (
        <LinearGradient colors={[...bg]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.btn, shadows.glow]}>
          {loading ? <ActivityIndicator color={colors.navy} /> : <Text style={styles.btnTextGold}>{title}</Text>}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.btn,
            isOutline && { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.gold },
            isGhost && { backgroundColor: 'transparent' },
          ]}
        >
          {loading ? (
            <ActivityIndicator color={colors.gold} />
          ) : (
            <Text style={[styles.btnText, isOutline && { color: colors.gold }, isGhost && { color: colors.ivoryMuted }]}>{title}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ---------- Card ----------
export function Card({ children, style, goldBorder }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; goldBorder?: boolean }) {
  return (
    <View style={[styles.card, goldBorder && { borderColor: colors.goldSoft, borderWidth: 1 }, style]}>{children}</View>
  );
}

// ---------- StreakRing ----------
interface StreakRingProps {
  streak: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function StreakRing({ streak, size = 132, strokeWidth = 9, label }: StreakRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(streak / 30, 1);
  const offset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={colors.navyBorder} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.gold}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.streakNum}>{streak}</Text>
        <Text style={styles.streakLabel}>{label ?? 'day streak'}</Text>
      </View>
    </View>
  );
}

// ---------- ScriptureCard ----------
export function ScriptureCard({ text, reference }: { text: string; reference: string }) {
  return (
    <Card goldBorder style={styles.scriptureCard}>
      <Text style={styles.scriptureText}>“{text}”</Text>
      <Text style={styles.scriptureRef}>— {reference}</Text>
    </Card>
  );
}

// ---------- SectionHeader ----------
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  btn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  btnText: {
    color: colors.ivory,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  btnTextGold: {
    color: colors.navyDeep,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.navyCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  scriptureCard: {
    backgroundColor: 'rgba(27,45,71,0.9)',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  scriptureText: {
    ...typography.serif.scriptureLarge,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scriptureRef: {
    ...typography.sans.caption,
    color: colors.goldBright,
    textAlign: 'center',
    letterSpacing: 1,
  },
  streakNum: {
    ...typography.serif.display,
    color: colors.goldBright,
  },
  streakLabel: {
    ...typography.sans.label,
    color: colors.ivoryMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.sans.title,
    color: colors.ivory,
  },
  sectionAction: {
    ...typography.sans.label,
    color: colors.gold,
  },
});
