import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useExpenseStore, Expense } from '../store/useExpenseStore';
import HeroSparklineChart from './hero/HeroSparklineChart';
import HeroMetricChips from './hero/HeroMetricChips';

type Props = {
  totalExpenseThisMonth: number;
  totalIncomeThisMonth: number;
  totalSavingThisMonth: number;
  expenses: Expense[];
};

export default function HeroBalanceCard({
  totalExpenseThisMonth,
  totalIncomeThisMonth,
  totalSavingThisMonth,
  expenses,
}: Props) {
  const { isBalanceHidden, toggleBalanceHidden } = useExpenseStore();

  const netBalance = totalIncomeThisMonth - totalExpenseThisMonth - totalSavingThisMonth;
  const currentMonthYear = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View
      className="rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden border border-indigo-500/20"
      style={{ backgroundColor: '#0f172a' }}
    >
      <View className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-30" style={{ backgroundColor: '#6366f1' }} />
      <View className="absolute -left-8 -top-8 w-28 h-28 rounded-full opacity-20" style={{ backgroundColor: '#8b5cf6' }} />

      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">
            Sisa Saldo Bulan Ini
          </Text>
          <View className="flex-row items-center gap-2.5 mt-1">
            <Text className="text-2xl font-black tracking-tight text-white">
              {isBalanceHidden ? '••••••••' : `Rp ${netBalance.toLocaleString('id-ID')}`}
            </Text>
            <TouchableOpacity onPress={toggleBalanceHidden} activeOpacity={0.7} className="p-1">
              {isBalanceHidden ? <EyeOff size={18} color="#A5B4FC" /> : <Eye size={18} color="#A5B4FC" />}
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Text className="text-[10px] font-extrabold text-indigo-100">● {currentMonthYear}</Text>
        </View>
      </View>

      <HeroSparklineChart expenses={expenses} />

      <HeroMetricChips
        totalIncomeThisMonth={totalIncomeThisMonth}
        totalExpenseThisMonth={totalExpenseThisMonth}
        totalSavingThisMonth={totalSavingThisMonth}
        isBalanceHidden={isBalanceHidden}
      />
    </View>
  );
}
