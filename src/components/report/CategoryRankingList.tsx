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
    <View className="mt-4 pt-4 border-t border-zinc-800">
      <Text className="text-zinc-400 text-xs font-bold uppercase mb-3">
        Pos Pengeluaran Terbesar
      </Text>
      {rankings.map(cat => (
        <View key={cat.id} className="mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-zinc-200 text-xs font-medium">
              {cat.icon} {cat.name}
            </Text>
            <Text className="text-zinc-400 text-xs font-bold">
              Rp {cat.total.toLocaleString('id-ID')} ({cat.percentage}%)
            </Text>
          </View>
          <View className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
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
