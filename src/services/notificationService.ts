import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const settings: any = await Notifications.getPermissionsAsync();
    let granted = settings.granted || settings.status === 'granted';
    if (!granted) {
      const requested: any = await Notifications.requestPermissionsAsync();
      granted = requested.granted || requested.status === 'granted';
    }
    return !!granted;
  } catch {
    return false;
  }
}

export async function scheduleDailyAlarm(alarmTime: string): Promise<void> {
  if (Platform.OS === 'web') return;
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const parts = alarmTime.split(':');
    const hour = parseInt(parts[0], 10) || 20;
    const minute = parseInt(parts[1], 10) || 0;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Pengingat Keuangan',
        body: 'Hari ini kamu belum mencatat keuangan lho. Yuk catat sekarang agar keuanganmu terkontrol!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch (err) {
    console.error('Error scheduling alarm notification:', err);
  }
}

export async function cancelAllAlarms(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {}
}
