// FaithBlock AI Service - uses OmniRoute OpenAI-compatible endpoint
// Generates personalized prayers and devotionals.

import { PrayerFocus, PrayerMood } from '../data/prayers';
import { getVerseOfDay } from '../data/bible';

const API_URL = process.env.OPENROUTER_API_URL || 'http://localhost:20128/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = process.env.OPENROUTER_MODEL || 'auto/best-coding';

const FALLBACK_PRAYER =
  'Heavenly Father, thank You for this moment of prayer. I come to You with an open heart, laying before You my joys, my worries, and my hopes. Guide my steps today, fill me with Your peace, and help me to love as You love. In Jesus\u2019 name, Amen.';

const FALLBACK_DEVOTIONAL =
  'Today, rest in the truth that God is with you. Whatever you face, He is your refuge and strength, a very present help in trouble. Take a quiet moment to breathe, to be still, and to know that He is God. You are not alone, and you are deeply loved.';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function chat(messages: ChatMessage[], maxTokens = 500): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature: 0.8,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error('Empty response');
    return content;
  } catch (e) {
    console.warn('FaithBlock AI fallback:', e);
    return '';
  }
}

export interface GeneratedPrayer {
  text: string;
  verse: { text: string; reference: string };
}

/** Generate a personalized prayer based on mood + focus */
export async function generatePrayer(mood: PrayerMood, focus: PrayerFocus, name?: string): Promise<GeneratedPrayer> {
  const verse = getVerseOfDay(Math.floor(Date.now() / 86400000));

  const system = `You are a warm, compassionate Christian prayer writer. Write short, Bible-rooted prayers (70-110 words) in modern English. Style: comforting, safe, hopeful, emotionally grounding. Address God as "Father" or "Heavenly Father", end with "In Jesus' name, Amen." Use clear, gentle language. Do not be preachy or formal. Original writing - do not quote long scripture, just weave a single biblical promise in naturally.`;

  const user = `Mood: ${mood}. Focus: ${focus}${name ? `. Person to pray for: ${name}` : ''}. Today's scripture: "${verse.text}" (${verse.reference}). Write a short prayer for this person in this moment.`;

  const text = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    300,
  );

  return {
    text: text || FALLBACK_PRAYER,
    verse,
  };
}

export interface Devotional {
  title: string;
  verse: { text: string; reference: string };
  reading: string;
  reflection: string;
  prayer: string;
  challenge: string;
}

/** Generate a daily devotional */
export async function generateDevotional(dayIndex: number): Promise<Devotional> {
  const verse = getVerseOfDay(dayIndex);

  const system = `You are a gentle Christian devotional writer for a modern app audience (ages 18-35). Write an original daily devotional. Style: warm, hopeful, practical, non-preachy, feminine-friendly but universal. Keep it under 180 words total. Structure EXACTLY as:
TITLE: (4-7 words, warm)
READING: (60-80 words reflection on the verse, tying it to daily life - stress, self-care, relationships, faith)
REFLECTION: (2 short questions to ponder, one line each)
PRAYER: (a short 2-3 sentence prayer, ends "In Jesus' name, Amen.")
CHALLENGE: (one simple action for today, 1 sentence)
Do not quote the verse again. Original writing.`;

  const user = `Today's scripture: "${verse.text}" (${verse.reference}). Write the devotional.`;

  const content = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    400,
  );

  if (content) {
    const get = (label: string) => {
      const match = content.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`));
      return match ? match[1].trim() : '';
    };
    const title = get('TITLE') || 'Rest in His Peace';
    const reading = get('READING') || FALLBACK_DEVOTIONAL;
    const reflection = get('REFLECTION') || 'What is one worry I can hand over to God today?';
    const prayer = get('PRAYER') || FALLBACK_PRAYER;
    const challenge = get('CHALLENGE') || 'Take 60 seconds to be still and breathe deeply.';
    return { title, verse, reading, reflection, prayer, challenge };
  }

  return {
    title: 'Rest in His Peace',
    verse,
    reading: FALLBACK_DEVOTIONAL,
    reflection: 'What is one worry I can hand over to God today?\nWhere do I most need to trust Him?',
    prayer: FALLBACK_PRAYER,
    challenge: 'Take 60 seconds to be still and breathe deeply.',
  };
}

/** Get a morning affirmation based on need */
export async function generateAffirmation(need: string): Promise<{ affirmation: string; verse: { text: string; reference: string } }> {
  const verse = getVerseOfDay(Math.floor(Date.now() / 86400000));
  const system = `You write short, powerful Christian affirmations (25-40 words) in first person, rooted in Scripture but original. Warm and hopeful. For daily mental health and faith.`;

  const user = `Need: ${need}. Write one affirmation.`;
  const affirmation = await chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    150,
  );

  return {
    affirmation: affirmation || `I am held, I am loved, and I am never alone. God's peace fills my heart today.`,
    verse,
  };
}
