import React from 'react';
import { View, Text } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react-native';

type Props = {
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  totalSavingThisMonth: number;
  isBalanceHidden: boolean;
};

export default function HeroMetricChips({
  totalIncomeThisMonth,
  totalExpenseThisMonth,
  totalSavingThisMonth,
  isBalanceHidden,
}: Props) {
  return (
    <View className="flex-row gap-2 mt-1.5 p-2 bg-white/5 rounded-2xl border border-white/10">
      <View className="flex-1 flex-row items-center gap-1.5">
        <View className="w-6 h-6 rounded-lg bg-emerald-500/20 items-center justify-center">
          <ArrowDownLeft size={13} color="#34D399" />
        </View>
        <View className="flex-1">
          <Text className="text-[9px] text-slate-300 font-medium">Masuk</Text>
          <Text className="text-[11px] font-bold text-emerald-300" numberOfLines={1}>
            {isBalanceHidden ? '••••' : `+${totalIncomeThisMonth.toLocaleString('id-ID')}`}
          </Text>
        </View>
      </View>

      <View className="flex-1 flex-row items-center gap-1.5">
        <View className="w-6 h-6 rounded-lg bg-rose-500/20 items-center justify-center">
          <ArrowUpRight size={13} color="#FB7185" />
        </View>
        <View className="flex-1">
          <Text className="text-[9px] text-slate-300 font-medium">Keluar</Text>
          <Text className="text-[11px] font-bold text-rose-300" numberOfLines={1}>
            {isBalanceHidden ? '••••' : `-${totalExpenseThisMonth.toLocaleString('id-ID')}`}
          </Text>
        </View>
      </View>

      <View className="flex-1 flex-row items-center gap-1.5">
        <View className="w-6 h-6 rounded-lg bg-sky-500/20 items-center justify-center">
          <PiggyBank size={13} color="#38BDF8" />
        </View>
        <View className="flex-1">
          <Text className="text-[9px] text-slate-300 font-medium">Tabungan</Text>
          <Text className="text-[11px] font-bold text-sky-300" numberOfLines={1}>
            {isBalanceHidden ? '••••' : `${totalSavingThisMonth.toLocaleString('id-ID')}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

