import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

export async function scheduleEventReminder(
  title: string,
  body: string,
  scheduledDate: Date,
): Promise<string | null> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return null;

    const triggerDate = new Date(scheduledDate.getTime() - 60 * 60 * 1000); // 1 hour before
    if (triggerDate <= new Date()) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ Reminder: ${title}`,
        body,
        sound: true,
        data: { type: 'calendar_reminder' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
    });
    return id;
  } catch {
    return null;
  }
}

export async function scheduleDailyMarketingTip(): Promise<void> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 E-S Marketing Hub',
        body: 'Your daily marketing tip is ready! Open the app to boost your campaigns.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });
  } catch {
    // silent fail on unsupported platforms
  }
}

export async function cancelNotification(id: string): Promise<void> {
  try { await Notifications.cancelScheduledNotificationAsync(id); } catch {}
}

export async function cancelAllNotifications(): Promise<void> {
  try { await Notifications.cancelAllScheduledNotificationsAsync(); } catch {}
}
