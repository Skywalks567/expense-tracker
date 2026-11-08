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
};

export default function BudgetWarningCard({
  budgetMode, monthlyBudget, totalIncomeThisMonth,
  totalExpenseToday, totalExpenseThisMonth, totalSavingThisMonth,
}: Props) {
  const isAuto = budgetMode === 'auto';
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const currentDay = date.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);

  // Sisa saldo kas riil bulan ini (sama persis seperti di HeroBalanceCard)
  const sisaSaldo = totalIncomeThisMonth - totalExpenseThisMonth - totalSavingThisMonth;
  const hasIncome = totalIncomeThisMonth > 0;

  // Guardrail Manual: jika saldo kas riil < budget manual, batasi dengan sisa saldo
  const isCashCapped = !isAuto && hasIncome && sisaSaldo < monthlyBudget;

  // Kas riil sebelum hari ini untuk mode auto
  const pastExpense = Math.max(0, totalExpenseThisMonth - totalExpenseToday);
  const autoCashPool = Math.max(0, totalIncomeThisMonth - pastExpense - totalSavingThisMonth);

  const pool = isAuto ? autoCashPool : (isCashCapped ? Math.max(0, sisaSaldo) : monthlyBudget);
  const isBudgetValid = isAuto ? hasIncome : monthlyBudget > 0;
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

        <View className={`px-2 py-0.5 rounded-md ${badgeBg}`}>
          <Text className={`text-[10px] font-extrabold ${badgeText}`}>
            {isBudgetValid ? remainingText : (isAuto ? 'Belum Ada Pemasukan' : 'Budget Belum Diatur')}
          </Text>
        </View>
      </View>

      <View className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2 border border-slate-200">
        <View className={`h-full rounded-full ${barBg}`} style={{ width: `${percentage}%` }} />
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-[10px] text-slate-500 font-medium">
          Terpakai: <Text className="text-slate-800 font-bold">Rp {totalExpenseToday.toLocaleString('id-ID')}</Text>
        </Text>
        <Text className="text-[10px] text-slate-500 font-medium">
          Jatah Hari Ini: <Text className="text-slate-800 font-bold">Rp {dailyBudget.toLocaleString('id-ID')}</Text>
          {isBudgetValid && (
            <Text className="text-[9px] text-slate-400"> ({remainingDays} hari lagi)</Text>
          )}
        </Text>
      </View>

      {isCashCapped && (
        <View className="mt-2 pt-1.5 border-t border-amber-100 flex-row items-center gap-1">
          <AlertTriangle size={11} color="#D97706" />
          <Text className="text-[9px] text-amber-700 font-medium flex-1">
            Dibatasi karena sisa saldo lebih kecil dari budget
          </Text>
        </View>
      )}
    </View>
  );
}
