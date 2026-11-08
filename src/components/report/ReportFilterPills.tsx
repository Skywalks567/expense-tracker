import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { TransactionType } from '../../types/expense';

type Props = {
  filterType: 'all' | TransactionType;
  onFilterChange: (type: 'all' | TransactionType) => void;
};

export default function ReportFilterPills({ filterType, onFilterChange }: Props) {
  const filters: { key: 'all' | TransactionType; label: string; activeStyle: string; textStyle: string }[] = [
    { key: 'all', label: 'Semua', activeStyle: 'bg-indigo-600 border-indigo-600', textStyle: 'text-white' },
    { key: 'expense', label: 'Pengeluaran', activeStyle: 'bg-rose-50 border-rose-300', textStyle: 'text-rose-600' },
    { key: 'income', label: 'Pemasukan', activeStyle: 'bg-emerald-50 border-emerald-300', textStyle: 'text-emerald-600' },
    { key: 'saving', label: 'Tabungan', activeStyle: 'bg-sky-50 border-sky-300', textStyle: 'text-sky-600' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row gap-2">
        {filters.map((f) => {
          const isActive = filterType === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => onFilterChange(f.key)}
              className={`px-4 py-2 rounded-2xl border ${
                isActive ? f.activeStyle : 'bg-white border-slate-200'
              }`}
            >
              <Text className={`text-xs font-bold ${isActive ? f.textStyle : 'text-slate-600'}`}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

