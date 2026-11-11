import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { X, Calendar, Sliders } from 'lucide-react-native';
import MonthGridPicker from './MonthGridPicker';
import InteractiveRangeCalendar from './InteractiveRangeCalendar';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectMonthDate: (date: Date) => void;
  startDate: string;
  endDate: string;
  onApplyCustomRange: (start: string, end: string) => void;
};

export default function ReportDatePickerModal({
  visible,
  onClose,
  selectedDate,
  onSelectMonthDate,
  startDate,
  endDate,
  onApplyCustomRange,
}: Props) {
  const [tab, setTab] = useState<'month' | 'custom'>('month');
  const [pickerYear, setPickerYear] = useState(selectedDate.getFullYear());

  const handleSelectMonth = (monthIdx: number) => {
    const d = new Date(pickerYear, monthIdx, 1);
    onSelectMonthDate(d);
    onClose();
  };

  const handleApplyCustom = (s: string, e: string) => {
    onApplyCustomRange(s, e);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-4">
        <View className="bg-white rounded-[32px] p-5 w-full max-w-sm" style={{ elevation: 5 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm font-black text-slate-900">Periode Laporan</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mode Switcher */}
          <View className="bg-slate-100 p-1 rounded-2xl flex-row items-center mb-3">
            <TouchableOpacity
              onPress={() => setTab('month')}
              className={`flex-1 py-1.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
                tab === 'month' ? 'bg-white' : ''
              }`}
            >
              <Calendar size={12} color={tab === 'month' ? '#4F46E5' : '#64748B'} />
              <Text className={`text-xs font-bold ${tab === 'month' ? 'text-indigo-600' : 'text-slate-600'}`}>
                Per Bulan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTab('custom')}
              className={`flex-1 py-1.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
                tab === 'custom' ? 'bg-white' : ''
              }`}
            >
              <Sliders size={12} color={tab === 'custom' ? '#4F46E5' : '#64748B'} />
              <Text className={`text-xs font-bold ${tab === 'custom' ? 'text-indigo-600' : 'text-slate-600'}`}>
                Rentang Kustom
              </Text>
            </TouchableOpacity>
          </View>

          {tab === 'month' ? (
            <MonthGridPicker
              selectedYear={pickerYear}
              onYearChange={setPickerYear}
              selectedMonth={selectedDate.getMonth()}
              onSelectMonth={handleSelectMonth}
            />
          ) : (
            <InteractiveRangeCalendar
              initialStart={startDate}
              initialEnd={endDate}
              onApply={handleApplyCustom}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
