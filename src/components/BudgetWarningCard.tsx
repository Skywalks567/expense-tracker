import React from 'react';
import { View, Text } from 'react-native';
import { Target, Zap, SlidersHorizontal, AlertTriangle } from 'lucide-react-native';

type Props = {
  budgetMode: 'auto' | 'manual';
  monthlyBudget: number;
  totalIncomeThisMonth: number;
  totalExpenseToday: number;
  totalExpenseThisMonth: number;
  totalSavingThisMonth: number;
  currentCashBalance?: number;
};

export default function BudgetWarningCard({
  budgetMode, monthlyBudget, totalIncomeThisMonth,
  totalExpenseToday, totalExpenseThisMonth, totalSavingThisMonth,
  currentCashBalance,
}: Props) {
  const isAuto = budgetMode === 'auto';
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const currentDay = date.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);

  // Kas riil awal hari ini (sebelum belanjaan hari ini)
  const realCashPool = currentCashBalance !== undefined
    ? Math.max(0, currentCashBalance + totalExpenseToday)
    : Math.max(0, totalIncomeThisMonth - Math.max(0, totalExpenseThisMonth - totalExpenseToday) - totalSavingThisMonth);

  const hasFunds = currentCashBalance !== undefined ? (realCashPool > 0 || totalIncomeThisMonth > 0) : totalIncomeThisMonth > 0;
  const isCashCapped = !isAuto && hasFunds && realCashPool < monthlyBudget;

  const pool = isAuto ? realCashPool : (isCashCapped ? realCashPool : monthlyBudget);
  const isBudgetValid = isAuto ? hasFunds : monthlyBudget > 0;
  const dailyBudget = isBudgetValid ? Math.floor(pool / remainingDays) : 0;

  const remaining = dailyBudget - totalExpenseToday;
  const percentage = dailyBudget > 0 ? Math.min((totalExpenseToday / dailyBudget) * 100, 100) : (totalExpenseToday > 0 ? 100 : 0);
  const isOverBudget = dailyBudget > 0 ? totalExpenseToday > dailyBudget : totalExpenseToday > 0;
  const isNearBudget = percentage >= 80 && !isOverBudget;

  let barBg = 'bg-indigo-600';
  let badgeBg = 'bg-indigo-50';
  let badgeText = 'text-indigo-600';
  let remainingText = `Sisa Rp ${Math.max(0, remaining).toLocaleString('id-ID')}`;

  if (isOverBudget) {
    barBg = 'bg-rose-500';
    badgeBg = 'bg-rose-50';
    badgeText = 'text-rose-600';
    remainingText = `Lebih Rp ${Math.abs(remaining).toLocaleString('id-ID')}`;
  } else if (isNearBudget) {
    barBg = 'bg-amber-500';
    badgeBg = 'bg-amber-50';
    badgeText = 'text-amber-700';
  }

  return (
    <View className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-5 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 rounded-lg bg-indigo-50 items-center justify-center">
            <Target size={15} color="#4F46E5" />
          </View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs font-bold text-slate-800">Batas Harian</Text>
            <View className={`px-1.5 py-0.5 rounded-full flex-row items-center gap-0.5 ${isAuto ? 'bg-indigo-50' : 'bg-slate-100'}`}>
              {isAuto ? <Zap size={10} color="#4F46E5" /> : <SlidersHorizontal size={10} color="#64748B" />}
              <Text className={`text-[9px] font-bold ${isAuto ? 'text-indigo-600' : 'text-slate-600'}`}>
                {isAuto ? 'Auto' : 'Manual'}
              </Text>
            </View>
          </View>
        </View>

        <View className={`px-2 py-1 rounded-lg ${badgeBg}`}>
          <Text className={`text-[10px] font-extrabold ${badgeText}`}>{remainingText}</Text>
        </View>
      </View>

      <View className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
        <View className={`h-full rounded-full ${barBg}`} style={{ width: `${percentage}%` }} />
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-[10px] font-bold text-slate-400">
          Terpakai: Rp {totalExpenseToday.toLocaleString('id-ID')}
        </Text>
        <Text className="text-[10px] font-bold text-slate-600">
          Batas: Rp {dailyBudget.toLocaleString('id-ID')}
        </Text>
      </View>

      {isCashCapped && (
        <View className="flex-row items-center gap-1 mt-2 pt-2 border-t border-slate-100">
          <AlertTriangle size={11} color="#D97706" />
          <Text className="text-[9px] font-medium text-amber-700">
            Disesuaikan ke kas riil (Rp {realCashPool.toLocaleString('id-ID')}) agar tidak defisit
          </Text>
        </View>
      )}
    </View>
  );
}
