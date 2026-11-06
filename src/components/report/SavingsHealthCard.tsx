import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';

type Props = {
  savingsRate: number;
  totalSaving: number;
};

export default function SavingsHealthCard({ savingsRate, totalSaving }: Props) {
  let healthStatus = 'Belum Ada Alokasi Tabungan';
  let badgeBg = 'bg-slate-100';
  let badgeText = 'text-slate-600';

  if (savingsRate >= 20) {
    healthStatus = 'Sangat Sehat! Target 20%+ tercapai';
    badgeBg = 'bg-emerald-50 border border-emerald-200';
    badgeText = 'text-emerald-700';
  } else if (savingsRate >= 10) {
    healthStatus = 'Cukup Baik! Pertahankan tabunganmu';
    badgeBg = 'bg-indigo-50 border border-indigo-200';
    badgeText = 'text-indigo-700';
  } else if (totalSaving > 0) {
    healthStatus = 'Awal yang baik! Terus tingkatkan tabunganmu';
    badgeBg = 'bg-amber-50 border border-amber-200';
    badgeText = 'text-amber-800';
  }

  return (
    <View className="bg-white border border-slate-200/90 p-5 rounded-3xl mb-5 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-xl bg-amber-50 items-center justify-center mr-2.5">
            <Sparkles size={16} color="#D97706" />
          </View>
          <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
            Savings Rate (Rasio Tabungan)
          </Text>
        </View>
        <Text className="text-indigo-600 font-black text-2xl">{savingsRate}%</Text>
      </View>

      {/* Progress Bar Savings */}
      <View className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200">
        <View
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${Math.min(savingsRate, 100)}%` }}
        />
      </View>

      <View className={`self-start px-3 py-1.5 rounded-xl ${badgeBg}`}>
        <Text className={`text-xs font-bold ${badgeText}`}>
          {healthStatus}
        </Text>
      </View>
    </View>
  );
}
