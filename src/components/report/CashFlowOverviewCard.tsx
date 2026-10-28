import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react-native';

type Props = {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
};

export default function CashFlowOverviewCard({ totalIncome, totalExpense, totalSaving }: Props) {
  return (
    <View className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-6">
      <Text className="text-white font-bold text-base mb-4">Arus Kas Bulan Ini</Text>
      <View className="space-y-3">
        {/* Pemasukan */}
        <View className="flex-row justify-between items-center py-2 border-b border-zinc-800/80">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-emerald-500/20 items-center justify-center mr-3">
              <TrendingUp size={16} color="#10B981" />
            </View>
            <Text className="text-zinc-300 text-sm">Total Pemasukan</Text>
          </View>
          <Text className="text-emerald-400 font-bold text-base">
            +Rp {totalIncome.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Pengeluaran */}
        <View className="flex-row justify-between items-center py-2 border-b border-zinc-800/80">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-rose-500/20 items-center justify-center mr-3">
              <TrendingDown size={16} color="#F43F5E" />
            </View>
            <Text className="text-zinc-300 text-sm">Total Pengeluaran</Text>
          </View>
          <Text className="text-rose-400 font-bold text-base">
            -Rp {totalExpense.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Tabungan */}
        <View className="flex-row justify-between items-center py-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-blue-500/20 items-center justify-center mr-3">
              <PiggyBank size={16} color="#3B82F6" />
            </View>
            <Text className="text-zinc-300 text-sm">Total Ditabung</Text>
          </View>
          <Text className="text-blue-400 font-bold text-base">
            Rp {totalSaving.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </View>
  );
}
