// FaithBlock storage hooks - AsyncStorage-backed, no backend
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@faithblock/streak';
const JOURNAL_KEY = '@faithblock/journal';
const SETTINGS_KEY = '@faithblock/settings';
const PREMIUM_KEY = '@faithblock/premium';
const HISTORY_KEY = '@faithblock/history';

// ---------- Streak ----------
export interface StreakState {
  current: number;
  best: number;
  lastPrayedDay: string; // YYYY-MM-DD
  total: number;
}

const DAY_MS = 86400000;

export function dayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakState>({ current: 0, best: 0, lastPrayedDay: '', total: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STREAK_KEY);
        if (raw) setStreak(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const recordPrayer = useCallback(async () => {
    const today = dayKey();
    setStreak((prev) => {
      let next: StreakState;
      if (prev.lastPrayedDay === today) {
        next = { ...prev }; // already prayed today
      } else {
        const yesterday = dayKey(new Date(Date.now() - DAY_MS));
        const continued = prev.lastPrayedDay === yesterday;
        const current = continued ? prev.current + 1 : 1;
        next = {
          current,
          best: Math.max(prev.best, current),
          lastPrayedDay: today,
          total: prev.total + 1,
        };
      }
      AsyncStorage.setItem(STREAK_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  }, []);

  return { streak, recordPrayer, loaded };
}

// ---------- Journal ----------
export interface JournalEntry {
  id: string;
  date: string; // ISO
  dateKey: string; // YYYY-MM-DD
  mood: string;
  text: string;
  verse?: string;
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(JOURNAL_KEY);
        if (raw) setEntries(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const addEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
    };
    setEntries((prev) => {
      const next = [newEntry, ...prev];
      AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
    return newEntry;
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  }, []);

  return { entries, addEntry, deleteEntry, loaded };
}

// ---------- Settings / Onboarding ----------
export interface Settings {
  onBoarded: boolean;
  name?: string;
  denomination?: string;
  blockedApps: string[];
  reminderTime?: string;
  notified?: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  onBoarded: false,
  name: '',
  blockedApps: [],
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SETTINGS_KEY);
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const update = useCallback(async (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  }, []);

  return { settings, update, loaded };
}

// ---------- Premium ----------
export function usePremium() {
  const [premium, setPremium] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PREMIUM_KEY);
        setPremium(raw === 'true');
      } catch (e) {
        console.warn(e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const unlock = useCallback(async () => {
    setPremium(true);
    await AsyncStorage.setItem(PREMIUM_KEY, 'true');
  }, []);

  return { premium, unlock, loaded };
}

// ---------- Prayer history (for recap) ----------
export interface PrayerRecord {
  date: string; // ISO
  dateKey: string;
  mood: string;
  focus: string;
}

export function useHistory() {
  const [history, setHistory] = useState<PrayerRecord[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        if (raw) setHistory(JSON.parse(raw));
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  const logPrayer = useCallback(async (mood: string, focus: string) => {
    const record: PrayerRecord = {
      date: new Date().toISOString(),
      dateKey: dayKey(),
      mood,
      focus,
    };
    setHistory((prev) => {
      const next = [record, ...prev].slice(0, 500);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(console.warn);
      return next;
    });
  }, []);

  return { history, logPrayer };
}

/** days since a date - used for streak calculations */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / DAY_MS);
}
