// FaithBlock native bridge - syncs blocked apps to the file the Android
// accessibility service reads, and provides accessibility settings helpers.
import { Platform } from 'react-native';
import { File, Paths } from 'expo-file-system';

const BLOCKED_FILE = 'blocked_apps.json';

/** App display-name -> package-name mapping for common distracting apps. */
export const APP_CATALOG: { name: string; pkg: string }[] = [
  { name: 'TikTok', pkg: 'com.zhiliaoapp.musically' },
  { name: 'Instagram', pkg: 'com.instagram.android' },
  { name: 'YouTube', pkg: 'com.google.android.youtube' },
  { name: 'X / Twitter', pkg: 'com.twitter.android' },
  { name: 'Facebook', pkg: 'com.facebook.katana' },
  { name: 'Games', pkg: 'com.faithblock.games' },
];

/** Map display names (used in onboarding/settings) to their actual packages. */
export function appPackageForName(name: string): string | undefined {
  return APP_CATALOG.find((a) => a.name === name)?.pkg;
}

export function appNameForPackage(pkg: string): string | undefined {
  return APP_CATALOG.find((a) => a.pkg === pkg)?.name;
}

/** Write the blocked-app packages to the shared JSON file read by native. */
export async function syncBlockedApps(displayNames: string[]): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    const packages = displayNames
      .map(appPackageForName)
      .filter((p): p is string => !!p);
    const file = new File(Paths.document, BLOCKED_FILE);
    if (file.exists) {
      file.delete();
    }
    file.create({ intermediates: true });
    file.write(JSON.stringify({ blocked: packages }));
  } catch (e) {
    console.warn('syncBlockedApps failed', e);
  }
}

/** Read back what the native service currently sees (debug / status). */
export async function readBlockedPackages(): Promise<string[]> {
  if (Platform.OS !== 'android') return [];
  try {
    const file = new File(Paths.document, BLOCKED_FILE);
    if (!file.exists) return [];
    const parsed = JSON.parse(await file.text());
    return Array.isArray(parsed?.blocked) ? parsed.blocked : [];
  } catch (e) {
    console.warn('readBlockedPackages failed', e);
    return [];
  }
}
