import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';

type Props = {
  savingsRate: number;
  totalSaving: number;
};

export default function SavingsHealthCard({ savingsRate, totalSaving }: Props) {
  let healthStatus = 'Belum Ada Alokasi Tabungan';
  let badgeBg = 'bg-zinc-800';
  let badgeText = 'text-zinc-400';

  if (savingsRate >= 20) {
    healthStatus = 'Sangat Sehat! Target 20%+ tercapai 🏆';
    badgeBg = 'bg-emerald-500/20';
    badgeText = 'text-emerald-400';
  } else if (savingsRate >= 10) {
    healthStatus = 'Cukup Baik! Pertahankan tabunganmu 👍';
    badgeBg = 'bg-blue-500/20';
    badgeText = 'text-blue-400';
  } else if (totalSaving > 0) {
    healthStatus = 'Awal yang baik! Terus tingkatkan tabunganmu 🌱';
    badgeBg = 'bg-amber-500/20';
    badgeText = 'text-amber-400';
  }

  return (
    <View className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Sparkles size={18} color="#F59E0B" />
          <Text className="text-white font-bold ml-2">Savings Rate (Rasio Tabungan)</Text>
        </View>
        <Text className="text-blue-400 font-extrabold text-2xl">{savingsRate}%</Text>
      </View>

      {/* Progress Bar Savings */}
      <View className="h-2.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-3">
        <View 
          className="h-full bg-blue-500 rounded-full" 
          style={{ width: `${Math.min(savingsRate, 100)}%` }} 
        />
      </View>

      <View className={`self-start px-3 py-1.5 rounded-xl ${badgeBg}`}>
        <Text className={`text-xs font-semibold ${badgeText}`}>
          {healthStatus}
        </Text>
      </View>
    </View>
  );
}
