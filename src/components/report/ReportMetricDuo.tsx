import React from 'react';
import { View, Text } from 'react-native';
import { PiggyBank, CalendarDays } from 'lucide-react-native';

type Props = {
  savingsRate: number;
  totalSaving: number;
  dailyAverage: number;
  daysCount: number;
};

export default function ReportMetricDuo({
  savingsRate,
  totalSaving,
  dailyAverage,
  daysCount,
}: Props) {
  const isHealthy = savingsRate >= 20;

  return (
    <View className="flex-row gap-3 mb-6">
      {/* 1. Rasio Tabungan */}
      <View
        className="bg-sky-50 border border-sky-200/80 rounded-3xl p-4 flex-1 justify-between"
        style={{ elevation: 1 }}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="w-8 h-8 rounded-xl bg-sky-600 items-center justify-center">
            <PiggyBank size={16} color="#FFFFFF" />
          </View>
          <Text className="text-base font-black text-sky-900">{savingsRate}%</Text>
        </View>
        <View>
          <Text className="text-[11px] font-black text-sky-950">Rasio Tabungan</Text>
          <View className="bg-white/80 border border-sky-200 px-1.5 py-0.5 rounded-md self-start mt-1">
            <Text className="text-[9px] font-bold text-sky-800">
              {isHealthy ? '⭐ Sangat Sehat' : 'Target 20%'}
            </Text>
          </View>
          <Text className="text-[9px] text-sky-700/80 font-medium mt-1">
            Ditabung: Rp {totalSaving.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      {/* 2. Rata-Rata Harian */}
      <View
        className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-4 flex-1 justify-between"
        style={{ elevation: 1 }}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="w-8 h-8 rounded-xl bg-emerald-600 items-center justify-center">
            <CalendarDays size={16} color="#FFFFFF" />
          </View>
          <View className="bg-white/80 border border-emerald-200 px-1.5 py-0.5 rounded-full">
            <Text className="text-[9px] font-black text-emerald-800">Rerata</Text>
          </View>
        </View>
        <View>
          <Text className="text-[11px] font-black text-emerald-950">Rata-Rata Harian</Text>
          <Text className="text-xs font-black text-emerald-950 mt-1">
            Rp {dailyAverage.toLocaleString('id-ID')}{' '}
            <Text className="text-[9px] font-normal text-emerald-700">/hari</Text>
          </Text>
          <Text className="text-[9px] text-emerald-700/80 font-medium mt-1">
            Dihitung dari {daysCount} hari
          </Text>
        </View>
      </View>
    </View>
  );
}
