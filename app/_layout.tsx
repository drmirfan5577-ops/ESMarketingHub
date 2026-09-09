import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from '@/template';
import { useEffect } from 'react';
import { scheduleDailyMarketingTip, requestNotificationPermissions } from '@/services/notifications';
import { AdminProvider } from '@/contexts/AdminContext';

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await requestNotificationPermissions();
      await scheduleDailyMarketingTip();
    })();
  }, []);
  return (
    <AlertProvider>
      <AdminProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="prompts" />
            <Stack.Screen name="medical" />
            <Stack.Screen name="videoad" />
            <Stack.Screen name="calendar" />
            <Stack.Screen name="roi" />
            <Stack.Screen name="game" />
            <Stack.Screen name="ai-copy" />
            <Stack.Screen name="template-editor" />
            <Stack.Screen name="trending-ads" />
            <Stack.Screen name="analytics-charts" />
            <Stack.Screen name="promo" />
            <Stack.Screen name="admin" />
            <Stack.Screen name="settings" />
          </Stack>
        </SafeAreaProvider>
      </AdminProvider>
    </AlertProvider>
  );
}
