import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Expense, Category } from '../../types/expense';

type Props = {
  expenses: Expense[];
  categories: Category[];
  totalExpense: number;
};

export default function ReportDonutHeroCard({ expenses, categories, totalExpense }: Props) {
  const size = 170;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const categoryTotals = categories
    .map((cat) => {
      const catExpenses = expenses.filter((e) => e.categoryId === cat.id && e.type === 'expense');
      const total = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      const count = catExpenses.length;
      const percentage = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;
      return { ...cat, total, count, percentage };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  let cumulative = 0;

  return (
    <View
      className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-4"
      style={{ elevation: 1 }}
    >
      <View className="flex-row justify-between items-center mb-1">
        <View>
          <Text className="text-xs font-black text-slate-800 uppercase tracking-wider">Distribusi Belanja</Text>
          <Text className="text-[10px] text-slate-400">Komposisi kategori pengeluaran</Text>
        </View>
        <View className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-indigo-600">{categoryTotals.length} Kategori</Text>
        </View>
      </View>

      <View className="items-center justify-center my-3">
        <View className="relative items-center justify-center">
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={size / 2} cy={size / 2} r={radius} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="transparent" />
            {totalExpense > 0 && categoryTotals.map((cat) => {
              const strokeDasharray = `${(cat.total / totalExpense) * circumference} ${circumference}`;
              const strokeDashoffset = -(cumulative * circumference);
              cumulative += cat.total / totalExpense;
              return (
                <Circle
                  key={cat.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={cat.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              );
            })}
          </Svg>
          <View className="absolute items-center justify-center px-4">
            <Text className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Total Belanja</Text>
            <Text className="text-lg font-black text-slate-900 mt-0.5">Rp {totalExpense.toLocaleString('id-ID')}</Text>
          </View>
        </View>
      </View>

      <View className="border-t border-slate-100 pt-3">
        {categoryTotals.length === 0 ? (
          <Text className="text-center text-xs text-slate-400 py-3">Belum ada pengeluaran di periode ini</Text>
        ) : (
          categoryTotals.map((cat) => (
            <View key={cat.id} className="bg-slate-50 border border-slate-100 p-2.5 rounded-2xl mb-2">
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-row items-center gap-2">
                  <View className="w-7 h-7 rounded-lg items-center justify-center bg-white border border-slate-200">
                    <Text className="text-xs">{cat.icon || '💳'}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-slate-800">{cat.name}</Text>
                    <Text className="text-[9px] text-slate-400">{cat.count} transaksi</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-xs font-black text-slate-900">Rp {cat.total.toLocaleString('id-ID')}</Text>
                  <Text className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md mt-0.5">
                    {cat.percentage}%
                  </Text>
                </View>
              </View>
              <View className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <View className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
