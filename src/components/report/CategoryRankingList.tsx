import React from 'react';
import { View, Text } from 'react-native';

export type CategoryRankingItem = {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  percentage: number;
};

type Props = {
  rankings: CategoryRankingItem[];
};

export default function CategoryRankingList({ rankings }: Props) {
  if (rankings.length === 0) return null;

  return (
    <View className="mt-4 pt-4 border-t border-slate-100">
      <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-3">
        Pos Pengeluaran Terbesar
      </Text>
      {rankings.map((cat) => (
        <View key={cat.id} className="mb-3">
          <View className="flex-row justify-between items-center mb-1.5">
            <Text className="text-slate-800 text-xs font-bold">
              {cat.icon} {cat.name}
            </Text>
            <Text className="text-slate-500 text-xs font-bold">
              Rp {cat.total.toLocaleString('id-ID')}{' '}
              <Text className="text-indigo-600">({cat.percentage}%)</Text>
            </Text>
          </View>
          <View className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <View
              className="h-full rounded-full"
              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
