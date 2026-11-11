import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { getCalendarGrid, getDaysDifference, CalendarDay } from './calendarUtils';

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type Props = {
  initialStart: string;
  initialEnd: string;
  onApply: (start: string, end: string) => void;
};

export default function InteractiveRangeCalendar({ initialStart, initialEnd, onApply }: Props) {
  const [viewDate, setViewDate] = useState(() => new Date(initialEnd || new Date()));
  const [rangeStart, setRangeStart] = useState<string | null>(initialStart || null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(initialEnd || null);
  const [error, setError] = useState<string | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const now = new Date();
  const isCurrentMonthView = year === now.getFullYear() && month >= now.getMonth();
  const days = getCalendarGrid(year, month);
  const monthTitle = viewDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

  const handleDayPress = (day: CalendarDay) => {
    if (day.isFuture) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day.dateStr);
      setRangeEnd(null);
      setError(null);
    } else if (day.dateStr < rangeStart) {
      setRangeStart(day.dateStr);
      setRangeEnd(null);
    } else {
      if (getDaysDifference(rangeStart, day.dateStr) > 30) {
        setError('Maksimal rentang adalah 30 hari');
        return;
      }
      setRangeEnd(day.dateStr);
      setError(null);
    }
  };

  const selectedCount = rangeStart && rangeEnd ? getDaysDifference(rangeStart, rangeEnd) : 0;
  const isReady = !!(rangeStart && rangeEnd);

  return (
    <View className="py-1">
      <View className="flex-row justify-between items-center mb-2 px-1">
        <TouchableOpacity onPress={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 rounded-lg bg-slate-100 items-center justify-center">
          <ChevronLeft size={14} color="#475569" />
        </TouchableOpacity>
        <Text className="text-xs font-black text-slate-800">{monthTitle}</Text>
        <TouchableOpacity
          onPress={() => !isCurrentMonthView && setViewDate(new Date(year, month + 1, 1))}
          disabled={isCurrentMonthView}
          className={`w-7 h-7 rounded-lg bg-slate-100 items-center justify-center ${isCurrentMonthView ? 'opacity-20' : ''}`}
        >
          <ChevronRight size={14} color="#475569" />
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-1">
        {DAY_LABELS.map((d) => (
          <Text key={d} className="flex-1 text-center text-[10px] font-bold text-slate-400">{d}</Text>
        ))}
      </View>

      <View className="flex-row flex-wrap mb-2">
        {days.map((d, idx) => {
          const isEdge = rangeStart === d.dateStr || rangeEnd === d.dateStr;
          const isInRange = rangeStart && rangeEnd && d.dateStr > rangeStart && d.dateStr < rangeEnd;

          return (
            <TouchableOpacity
              key={`${d.dateStr}_${idx}`}
              onPress={() => handleDayPress(d)}
              disabled={d.isFuture}
              className={`w-[14.28%] h-7 items-center justify-center ${isInRange ? 'bg-indigo-50' : ''}`}
            >
              <View className={`w-6 h-6 items-center justify-center rounded-full ${isEdge ? 'bg-indigo-600' : ''}`}>
                <Text className={`text-[10px] ${isEdge ? 'text-white font-black' : d.isFuture ? 'text-slate-300' : d.isCurrentMonth ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                  {d.dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? <Text className="text-[10px] font-bold text-rose-500 mb-2 text-center">{error}</Text> : null}

      <TouchableOpacity
        onPress={() => isReady && onApply(rangeStart!, rangeEnd!)}
        disabled={!isReady}
        className={`py-2.5 rounded-2xl items-center ${isReady ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <Text className={`text-xs font-black ${isReady ? 'text-white' : 'text-slate-400'}`}>
          {selectedCount > 0 ? `Terapkan (${selectedCount} Hari)` : 'Pilih Tanggal Selesai'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
