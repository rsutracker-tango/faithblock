import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettings, usePremium } from '../hooks/useStorage';
import { configureRevenueCat, checkPremium } from '../services/purchases';
import { colors } from '../theme';

export default function RootLayout() {
  const { settings, loaded } = useSettings();
  const { premium, unlock } = usePremium();
  const router = useRouter();
  const [rcReady, setRcReady] = useState(false);

  // Configure RevenueCat once at startup, then sync premium entitlement.
  useEffect(() => {
    (async () => {
      await configureRevenueCat();
      const isPremium = await checkPremium();
      if (isPremium && !premium) {
        await unlock();
      }
      setRcReady(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded && !settings.onBoarded) {
      router.replace('/onboarding');
    }
  }, [loaded, settings.onBoarded]);

  if (!loaded || !rcReady) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.navyDeep, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="prayer" options={{ presentation: 'card' }} />
        <Stack.Screen name="prayerlock" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
