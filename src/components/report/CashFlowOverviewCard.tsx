import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, PiggyBank } from 'lucide-react-native';

type Props = {
  totalIncome: number;
  totalExpense: number;
  totalSaving: number;
};

export default function CashFlowOverviewCard({
  totalIncome,
  totalExpense,
  totalSaving,
}: Props) {
  return (
    <View className="bg-white border border-slate-200/90 p-5 rounded-3xl mb-5 shadow-sm">
      <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-4">
        Arus Kas Bulan Ini
      </Text>
      <View className="space-y-3">
        {/* Pemasukan */}
        <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 items-center justify-center mr-3">
              <TrendingUp size={16} color="#059669" />
            </View>
            <Text className="text-slate-600 text-xs font-semibold">Total Pemasukan</Text>
          </View>
          <Text className="text-emerald-600 font-extrabold text-sm">
            +Rp {totalIncome.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Pengeluaran */}
        <View className="flex-row justify-between items-center py-2 border-b border-slate-100">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 items-center justify-center mr-3">
              <TrendingDown size={16} color="#E11D48" />
            </View>
            <Text className="text-slate-600 text-xs font-semibold">Total Pengeluaran</Text>
          </View>
          <Text className="text-rose-600 font-extrabold text-sm">
            -Rp {totalExpense.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Tabungan */}
        <View className="flex-row justify-between items-center py-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 items-center justify-center mr-3">
              <PiggyBank size={16} color="#0284C7" />
            </View>
            <Text className="text-slate-600 text-xs font-semibold">Total Ditabung</Text>
          </View>
          <Text className="text-sky-600 font-extrabold text-sm">
            Rp {totalSaving.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </View>
  );
}
