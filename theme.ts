// FaithBlock Design System - Tier 1 Christian Wellness Aesthetic
// Palette: warm dawn + deep navy + gold. Inspired by "radiant sunrise over calm water."

export const colors = {
  // Deep, sacred navy backgrounds
  navy: '#0F1B2D',
  navyDeep: '#0A1424',
  navySoft: '#16263D',
  navyCard: '#1B2D47',
  navyBorder: '#27405F',

  // Warm radiant gold (primary accent)
  gold: '#D4AF37',
  goldBright: '#F0D47A',
  goldSoft: '#8A7432',
  goldGlow: '#FFE9A8',

  // Warm ivory / cream text
  ivory: '#F8F4EA',
  ivoryMuted: '#C9C0AC',
  ivoryDim: '#8E8678',

  // Soft rose (warmth, feminine feel)
  rose: '#E8B4B8',
  roseDeep: '#C98A90',

  // Calm sage (peace)
  sage: '#A8C0A0',

  // Sky / dawn blues
  sky: '#9FC2E8',
  skyDeep: '#5B87B8',

  // Semantic
  success: '#7CC47C',
  warning: '#E8C46A',
  danger: '#E88A8A',

  // Gradients
  gradientDawn: ['#0A1424', '#16263D', '#27405F', '#4A3F6B'] as const,
  gradientGold: ['#D4AF37', '#F0D47A', '#FFE9A8'] as const,
  gradientSunset: ['#0F1B2D', '#2A2A4A', '#6B4A5A', '#C98A90'] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  // Serif for scripture & devotional text (reverent, elegant)
  serif: {
    fontFamily: undefined, // Uses platform serif default
    display: { fontSize: 40, lineHeight: 46, fontWeight: '700' as const },
    heading: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const },
    subheading: { fontSize: 22, lineHeight: 28, fontWeight: '600' as const },
    scripture: { fontSize: 18, lineHeight: 30, fontWeight: '500' as const },
    scriptureLarge: { fontSize: 22, lineHeight: 36, fontWeight: '500' as const },
  },
  sans: {
    fontFamily: undefined,
    title: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
    body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
    label: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 8,
  },
};

export const fonts = {
  serif: 'Georgia',
  sans: 'System',
};
