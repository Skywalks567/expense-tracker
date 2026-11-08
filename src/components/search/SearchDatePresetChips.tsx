import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

export type DatePreset = 'all' | 'today' | 'yesterday' | '7days' | 'month';

type Props = {
  activePreset: DatePreset;
  onSelect: (preset: DatePreset) => void;
};

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: 'yesterday', label: 'Kemarin' },
  { id: '7days', label: '7 Hari' },
  { id: 'month', label: 'Bulan Ini' },
];

export default function SearchDatePresetChips({ activePreset, onSelect }: Props) {
  return (
    <View className="mb-3.5" style={{ height: 36 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6, alignItems: 'center' }}
      >
        {PRESETS.map((p) => {
          const isActive = activePreset === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => onSelect(p.id)}
              activeOpacity={0.7}
              className={`px-3 py-1.5 rounded-full border ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-slate-100 border-slate-200'
              }`}
            >
              <Text
                className={`text-xs ${
                  isActive ? 'text-white font-bold' : 'text-slate-600 font-semibold'
                }`}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
