import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

type Props = {
  selectedYear: number;
  onYearChange: (year: number) => void;
  selectedMonth: number;
  onSelectMonth: (monthIndex: number) => void;
};

export default function MonthGridPicker({
  selectedYear,
  onYearChange,
  selectedMonth,
  onSelectMonth,
}: Props) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isCurrentYear = selectedYear >= currentYear;

  return (
    <View className="py-2">
      {/* Year Selector */}
      <View className="flex-row justify-between items-center mb-4 px-2">
        <TouchableOpacity
          onPress={() => onYearChange(selectedYear - 1)}
          activeOpacity={0.7}
          className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center"
        >
          <ChevronLeft size={16} color="#475569" />
        </TouchableOpacity>

        <Text className="text-sm font-black text-slate-800">{selectedYear}</Text>

        <TouchableOpacity
          onPress={() => !isCurrentYear && onYearChange(selectedYear + 1)}
          disabled={isCurrentYear}
          activeOpacity={0.7}
          className={`w-8 h-8 rounded-xl bg-slate-100 items-center justify-center ${
            isCurrentYear ? 'opacity-30' : ''
          }`}
        >
          <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      {/* 12 Months Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-2.5">
        {MONTH_NAMES.map((m, idx) => {
          const isSelected = selectedMonth === idx && !isCurrentYear ? false : (selectedMonth === idx);
          const isFuture = selectedYear === currentYear && idx > currentMonth;

          return (
            <TouchableOpacity
              key={m}
              onPress={() => !isFuture && onSelectMonth(idx)}
              disabled={isFuture}
              activeOpacity={0.7}
              className={`w-[31%] py-2.5 rounded-2xl items-center border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600'
                  : isFuture
                  ? 'bg-slate-50 border-slate-100 opacity-30'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSelected ? 'text-white' : isFuture ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {m}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

