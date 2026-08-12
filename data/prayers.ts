// FaithBlock Prayer Data
// Tier 1 original prayers organized by mood/need. AI generator uses these as structure + seed.

export type PrayerMood =
  | 'anxious'
  | 'tired'
  | 'grateful'
  | 'hopeful'
  | 'sad'
  | 'angry'
  | 'peaceful'
  | 'lonely'
  | 'overwhelmed'
  | 'celebrating';

export interface Mood {
  id: PrayerMood;
  label: string;
  emoji: string;
  color: string;
}

export const MOODS: Mood[] = [
  { id: 'grateful', label: 'Grateful', emoji: '🙏', color: '#D4AF37' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🕊️', color: '#9FC2E8' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌅', color: '#F0D47A' },
  { id: 'anxious', label: 'Anxious', emoji: '😟', color: '#C98A90' },
  { id: 'tired', label: 'Tired', emoji: '😴', color: '#8A7432' },
  { id: 'overwhelmed', label: 'Overwhelmed', emoji: '🌊', color: '#5B87B8' },
  { id: 'sad', label: 'Sad', emoji: '💧', color: '#6B8FC4' },
  { id: 'lonely', label: 'Lonely', emoji: '🤍', color: '#C9C0AC' },
  { id: 'angry', label: 'Angry', emoji: '🔥', color: '#D4884A' },
  { id: 'celebrating', label: 'Celebrating', emoji: '🎉', color: '#7CC47C' },
];

export type PrayerFocus = 'self' | 'family' | 'friends' | 'healing' | 'work' | 'finances' | 'world' | 'gratitude';

export const PRAYER_FOCUS: { id: PrayerFocus; label: string; emoji: string }[] = [
  { id: 'self', label: 'My Heart', emoji: '💗' },
  { id: 'family', label: 'My Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: 'My Friends', emoji: '🤝' },
  { id: 'healing', label: 'Someone Healing', emoji: '🌿' },
  { id: 'work', label: 'My Work & Studies', emoji: '💼' },
  { id: 'finances', label: 'My Finances', emoji: '💰' },
  { id: 'world', label: 'The World', emoji: '🌍' },
  { id: 'gratitude', label: 'Giving Thanks', emoji: '🌻' },
];

interface PrayerSeed {
  mood: PrayerMood;
  focus: PrayerFocus;
  text: string;
}

/** Original prayers used when offline / no AI key. Structured to teach the AI generator the style. */
export const PRAYERS: PrayerSeed[] = [
  {
    mood: 'anxious',
    focus: 'self',
    text: 'Heavenly Father, my heart is heavy with worry. You said in Your Word, "Be still, and know that I am God." Calm the storm within me. I give You every anxious thought, every fear I cannot name. Replace my worry with Your perfect peace that passes all understanding. In Jesus\u2019 name, Amen.',
  },
  {
    mood: 'tired',
    focus: 'self',
    text: 'Lord, I am weary in body and spirit. You promised that those who wait on You will renew their strength like eagles. Lift me up today. Give me the rest my soul needs and the energy to walk in Your purpose. I rest in You, knowing You are my strength and my shield. Amen.',
  },
  {
    mood: 'grateful',
    focus: 'gratitude',
    text: 'Gracious God, I come before You with a heart full of thanks. Thank You for this day, for breath in my lungs, for the love You have surrounded me with. Enter into His gates with thanksgiving, and into His courts with praise. I praise You, Lord, for Your goodness and Your mercy that endures forever. Amen.',
  },
  {
    mood: 'hopeful',
    focus: 'self',
    text: 'Father, You are the God of hope. You fill me with all joy and peace in believing. I hold onto Your promises, knowing that weeping may endure for a night, but joy comes in the morning. I look forward with hope, trusting that Your plans for me are good. Amen.',
  },
  {
    mood: 'sad',
    focus: 'self',
    text: 'Lord, my heart is heavy today. You are close to the brokenhearted and save those who are crushed in spirit. Hold me in Your arms. Wipe every tear from my eyes. Let me feel Your presence, and help me to trust that You are working all things for good. Amen.',
  },
  {
    mood: 'angry',
    focus: 'self',
    text: 'God, I am feeling angry and frustrated. Your Word says, "Be angry, and do not sin." I bring my anger to You. Let it not take root in my heart. Fill me with Your peace, help me to respond with love instead of rage, and give me a calm spirit. Amen.',
  },
  {
    mood: 'peaceful',
    focus: 'self',
    text: 'Heavenly Father, thank You for this moment of stillness. You keep me in perfect peace when my mind is stayed on You. Let this peace fill every part of my being. I rest in Your presence, safe and secure in Your love. Amen.',
  },
  {
    mood: 'lonely',
    focus: 'self',
    text: 'Lord, I feel alone. But Your Word says, "I will never leave thee, nor forsake thee." Remind me of Your constant presence. Fill this loneliness with Your love. Help me to reach out, and help me to know that I am never truly alone. Amen.',
  },
  {
    mood: 'overwhelmed',
    focus: 'self',
    text: 'Father, I feel overwhelmed by everything around me. Cast all your care upon Him, for He cares for you. I cast my burdens onto You now. Give me wisdom for each step, peace for my racing mind, and the strength to handle what today brings. Amen.',
  },
  {
    mood: 'celebrating',
    focus: 'gratitude',
    text: 'Lord, my heart is full of joy! You have done great things. Every good and perfect gift comes from You. I celebrate this moment with thanksgiving. Let my joy be complete in You, and may this happiness remind me of Your goodness. Amen.',
  },
];

/** Fallback: builds a simple prayer offline when no mood-specific match exists */
export function getFallbackPrayer(mood: PrayerMood): string {
  const match = PRAYERS.find((p) => p.mood === mood);
  return match ? match.text : PRAYERS[0].text;
}
