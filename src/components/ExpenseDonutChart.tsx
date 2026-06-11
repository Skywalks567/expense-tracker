import { View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Expense, Category } from '../store/useExpenseStore';

type Props = {
  expenses: Expense[];
  categories: Category[];
  totalExpense: number;
};

export default function ExpenseDonutChart({ expenses, categories, totalExpense }: Props) {
  const size = 180;
  const strokeWidth = 25;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Kelompokkan total pengeluaran per kategori
  const categoryTotals = categories.map(cat => {
    const total = expenses
      .filter(e => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, total };
  }).filter(cat => cat.total > 0);

  // Jika tidak ada data, tampilkan lingkaran abu-abu kosong
  if (totalExpense === 0 || categoryTotals.length === 0) {
    return (
      <View className="items-center justify-center my-6">
        <View className="relative items-center justify-center">
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#3F3F46" // zinc-700
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          </Svg>
          <View className="absolute items-center justify-center">
            <Text className="text-zinc-500 text-sm">Belum ada data</Text>
          </View>
        </View>
      </View>
    );
  }

  let cumulativePercent = 0;

  return (
    <View className="items-center justify-center my-6">
      <View className="relative items-center justify-center">
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {categoryTotals.map((cat, index) => {
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
        <View className="absolute items-center justify-center">
          <Text className="text-zinc-400 text-xs">Total Bulan Ini</Text>
          <Text className="text-white font-bold text-lg">
            Rp {totalExpense.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
      
      {/* Legend / Keterangan Warna */}
      <View className="flex-row flex-wrap justify-center mt-6 gap-x-4 gap-y-2">
        {categoryTotals.map(cat => (
          <View key={cat.id} className="flex-row items-center">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: cat.color }} />
            <Text className="text-zinc-300 text-xs">{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
