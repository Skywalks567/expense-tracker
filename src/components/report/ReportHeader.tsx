import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Calendar, Sliders } from 'lucide-react-native';

type Props = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenPicker: () => void;
  label: string;
  isCustom: boolean;
};

export default function ReportHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onOpenPicker,
  label,
  isCustom,
}: Props) {
  const now = new Date();
  const isCurrentMonth =
    !isCustom &&
    currentDate.getFullYear() === now.getFullYear() &&
    currentDate.getMonth() === now.getMonth();

  return (
    <View className="mb-4 pt-2">
      <View className="flex-row items-center gap-1.5 mb-1">
        <View className="w-2 h-2 rounded-full bg-indigo-600" />
        <Text className="text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
          Laporan Finansial
        </Text>
      </View>
      <Text className="text-slate-900 text-2xl font-black mb-3">Analisis Pengeluaran</Text>

      {/* Month & Period Navigator Capsule */}
      <View
        className="bg-white border border-slate-200/90 rounded-2xl p-2 flex-row items-center justify-between"
        style={{ elevation: 1 }}
      >
        <TouchableOpacity
          onPress={onPrevMonth}
          disabled={isCustom}
          activeOpacity={0.7}
          className={`w-8 h-8 rounded-xl bg-slate-100 items-center justify-center ${
            isCustom ? 'opacity-20' : ''
          }`}
        >
          <ChevronLeft size={16} color="#475569" />
        </TouchableOpacity>

        {/* Clickable Center Capsule to open full Date Picker Modal */}
        <TouchableOpacity
          onPress={onOpenPicker}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/60"
        >
          {isCustom ? <Sliders size={13} color="#4F46E5" /> : <Calendar size={13} color="#4F46E5" />}
          <Text className="text-xs font-black text-slate-800">{label}</Text>
          <Text className="text-[10px] text-slate-400">▾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNextMonth}
          disabled={isCurrentMonth || isCustom}
          activeOpacity={0.7}
          className={`w-8 h-8 rounded-xl bg-slate-100 items-center justify-center ${
            isCurrentMonth || isCustom ? 'opacity-20' : ''
          }`}
        >
          <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
