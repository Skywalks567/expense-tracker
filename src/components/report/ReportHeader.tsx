import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';

type Props = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export default function ReportHeader({ currentDate, onPrevMonth, onNextMonth }: Props) {
  const monthName = currentDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View className="mb-4 pt-2">
      <View className="flex-row items-center gap-1.5 mb-1">
        <View className="w-2 h-2 rounded-full bg-indigo-600" />
        <Text className="text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
          Laporan Finansial
        </Text>
      </View>
      <Text className="text-slate-900 text-2xl font-black mb-3">Analisis Pengeluaran</Text>

      {/* Month Navigator Capsule */}
      <View
        className="bg-white border border-slate-200/90 rounded-2xl p-2 flex-row items-center justify-between"
        style={{ elevation: 1 }}
      >
        <TouchableOpacity
          onPress={onPrevMonth}
          activeOpacity={0.7}
          className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center"
        >
          <ChevronLeft size={16} color="#475569" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-1.5">
          <Calendar size={14} color="#4F46E5" />
          <Text className="text-xs font-black text-slate-800">{monthName}</Text>
        </View>

        <TouchableOpacity
          onPress={onNextMonth}
          activeOpacity={0.7}
          className="w-8 h-8 rounded-xl bg-slate-100 items-center justify-center"
        >
          <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
