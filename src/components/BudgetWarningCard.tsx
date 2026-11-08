import React from 'react';
import { View, Text } from 'react-native';
import { Target } from 'lucide-react-native';

type Props = {
  monthlyBudget: number;
  totalExpenseToday: number;
  totalExpenseThisMonth: number;
  totalSavingThisMonth: number;
};

export default function BudgetWarningCard({
  monthlyBudget,
  totalExpenseToday,
  totalExpenseThisMonth,
  totalSavingThisMonth,
}: Props) {
  // Hitung jumlah hari & sisa hari di bulan ini (termasuk hari ini)
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const currentDay = date.getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay + 1);

  // Pengeluaran bulan ini sebelum hari ini
  const pastExpenseThisMonth = Math.max(0, totalExpenseThisMonth - totalExpenseToday);

  // Sisa dana yang aman dibelanjakan (dikurangi pengeluaran lalu & alokasi tabungan)
  const remainingPool = Math.max(0, monthlyBudget - pastExpenseThisMonth - totalSavingThisMonth);

  // Jatah belanja hari ini (Dynamic Rolling Daily Budget)
  const dailyBudget = monthlyBudget > 0 ? Math.floor(remainingPool / remainingDays) : 0;

  // Kalkulasi sisa & persentase
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
          <Text className="text-xs font-bold text-slate-800">
            Batas Pengeluaran Harian
          </Text>
        </View>

        <View className={`px-2 py-0.5 rounded-md ${badgeBg}`}>
          <Text className={`text-[10px] font-extrabold ${badgeText}`}>
            {monthlyBudget > 0 ? remainingText : 'Budget Belum Diatur'}
          </Text>
        </View>
      </View>

      {/* Progress Bar Container */}
      <View className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2 border border-slate-200">
        <View
          className={`h-full rounded-full ${barBg}`}
          style={{ width: `${percentage}%` }}
        />
      </View>

      {/* Footer Info */}
      <View className="flex-row justify-between items-center text-[10px]">
        <Text className="text-[10px] text-slate-500 font-medium">
          Terpakai:{' '}
          <Text className="text-slate-800 font-bold">
            Rp {totalExpenseToday.toLocaleString('id-ID')}
          </Text>
        </Text>
        <Text className="text-[10px] text-slate-500 font-medium">
          Jatah Hari Ini:{' '}
          <Text className="text-slate-800 font-bold">
            Rp {dailyBudget.toLocaleString('id-ID')}
          </Text>
          {monthlyBudget > 0 && (
            <Text className="text-[9px] text-slate-400"> ({remainingDays} hari lagi)</Text>
          )}
        </Text>
      </View>
    </View>
  );
}
