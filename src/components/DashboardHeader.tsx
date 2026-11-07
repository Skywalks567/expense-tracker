import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, Search, Settings } from 'lucide-react-native';

type Props = {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
};

export default function DashboardHeader({ onOpenSearch, onOpenSettings }: Props) {
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

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onOpenSearch}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 items-center justify-center shadow-sm"
        >
          <Search size={18} color="#475569" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenSettings}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 items-center justify-center shadow-sm"
        >
          <Settings size={18} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
