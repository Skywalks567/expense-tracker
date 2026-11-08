import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Expense, Category } from '../store/useExpenseStore';

type Props = {
  expenses: Expense[];
  categories: Category[];
  totalExpense: number;
};

export default function ExpenseDonutChart({ expenses, categories, totalExpense }: Props) {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Kelompokkan total pengeluaran per kategori
  const categoryTotals = categories
    .map((cat) => {
      const total = expenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...cat, total };
    })
    .filter((cat) => cat.total > 0);

  // Jika tidak ada data, tampilkan lingkaran abu-abu kosong
  if (totalExpense === 0 || categoryTotals.length === 0) {
    return (
      <View className="items-center justify-center my-4">
        <View className="relative items-center justify-center">
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0" // slate-200
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          </Svg>
          <View className="absolute items-center justify-center">
            <Text className="text-slate-400 text-xs font-bold">Belum ada data</Text>
          </View>
        </View>
      </View>
    );
  }

  let cumulativePercent = 0;

  return (
    <View className="items-center justify-center my-4">
      <View className="relative items-center justify-center">
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {categoryTotals.map((cat) => {
            const percent = cat.total / totalExpense;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -(cumulativePercent * circumference);
            cumulativePercent += percent;

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
        {/* Teks di tengah Donut */}
        <View className="absolute items-center justify-center px-4">
          <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Pengeluaran
          </Text>
          <Text className="text-slate-900 font-black text-base text-center mt-0.5">
            Rp {totalExpense.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>

      {/* Legend / Keterangan Warna */}
      <View className="flex-row flex-wrap justify-center mt-5 gap-x-4 gap-y-2">
        {categoryTotals.map((cat) => (
          <View key={cat.id} className="flex-row items-center">
            <View
              className="w-2.5 h-2.5 rounded-full mr-1.5"
              style={{ backgroundColor: cat.color }}
            />
            <Text className="text-slate-600 text-xs font-medium">{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
