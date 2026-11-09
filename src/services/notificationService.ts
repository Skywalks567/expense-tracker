import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Expense } from '../types/expense';

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

export async function syncSmartAlarm(alarmTime: string, expenses: Expense[]): Promise<void> {
  if (Platform.OS === 'web') return;
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const [hourStr, minStr] = alarmTime.split(':');
    const hour = parseInt(hourStr, 10) || 20;
    const minute = parseInt(minStr, 10) || 0;

    const now = new Date();
    const hasTransactionsToday = expenses.some((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    const todayAlarm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    const isPastAlarmToday = now.getTime() >= todayAlarm.getTime();

    const startOffset = (hasTransactionsToday || isPastAlarmToday) ? 1 : 0;

    // Jadwalkan 14 hari ke depan agar tidak membebani sistem jika aplikasi jarang dibuka
    for (let i = startOffset; i < startOffset + 14; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hour, minute, 0, 0);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Pengingat Keuangan',
          body: 'Hari ini kamu belum mencatat keuangan lho. Yuk catat sekarang agar keuanganmu terkontrol!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
        },
      });
    }
  } catch (err) {
    console.error('Error syncing smart alarm notification:', err);
  }
}

export const scheduleDailyAlarm = (alarmTime: string) => syncSmartAlarm(alarmTime, []);

export async function cancelAllAlarms(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch { }
}
