import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Target, AlertCircle } from 'lucide-react-native';

type Props = {
  monthlyBudget: number;
  totalExpenseToday: number;
  onEditBudget?: () => void;
};

export default function BudgetWarningCard({
  monthlyBudget,
  totalExpenseToday,
  onEditBudget,
}: Props) {
  // Hitung jumlah hari di bulan ini
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Hitung jatah harian
  const dailyBudget = Math.floor(monthlyBudget / daysInMonth);

  // Kalkulasi sisa & persentase
  const remaining = dailyBudget - totalExpenseToday;
  const percentage = Math.min((totalExpenseToday / (dailyBudget || 1)) * 100, 100);
  const isOverBudget = totalExpenseToday > dailyBudget;
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
    <TouchableOpacity
      activeOpacity={onEditBudget ? 0.8 : 1}
      onPress={onEditBudget}
      className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-5 shadow-sm"
    >
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
            {remainingText}
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
        </Text>
      </View>
    </TouchableOpacity>
  );
}
