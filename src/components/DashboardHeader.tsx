import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, Wallet } from 'lucide-react-native';

type Props = {
  onOpenAlarm: () => void;
  hasUnrecordedToday?: boolean;
};

export default function DashboardHeader({ onOpenAlarm, hasUnrecordedToday = true }: Props) {
  // Sapaan waktu dinamis tanpa emotikon
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18.5) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  // Tanggal hari ini dalam format Bahasa Indonesia
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View className="flex-row justify-between items-center mb-5 pt-2">
      <View className="flex-row items-center gap-3">
        <View className="w-11 h-11 rounded-2xl bg-indigo-600 items-center justify-center shadow-md shadow-indigo-300">
          <Wallet size={20} color="#FFFFFF" />
        </View>
        <View>
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {todayFormatted}
          </Text>
          <Text className="text-lg font-extrabold text-slate-900 leading-tight">
            {getGreeting()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onOpenAlarm}
        activeOpacity={0.7}
        className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 items-center justify-center shadow-sm relative"
      >
        <Bell size={20} color="#334155" />
        {hasUnrecordedToday && (
          <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
        )}
      </TouchableOpacity>
    </View>
  );
}
