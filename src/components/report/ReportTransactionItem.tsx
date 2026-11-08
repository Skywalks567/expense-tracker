import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Expense, Category } from '../../types/expense';

type Props = {
  item: Expense;
  category?: Category;
  onPressDelete: (id: string) => void;
};

export default function ReportTransactionItem({
  item,
  category,
  onPressDelete,
}: Props) {
  const isIncome = item.type === 'income';
  const isSaving = item.type === 'saving';

  let sign = '-';
  let amountColor = 'text-rose-600';
  if (isIncome) {
    sign = '+';
    amountColor = 'text-emerald-600';
  } else if (isSaving) {
    sign = '';
    amountColor = 'text-sky-600';
  }

  const itemDate = new Date(item.date);
  const formattedDate = !isNaN(itemDate.getTime())
    ? `${itemDate.getDate()} ${itemDate.toLocaleDateString('id-ID', { month: 'short' })}`
    : '';

  return (
    <View className="flex-row justify-between items-center bg-white p-4 rounded-2xl mb-2.5 border border-slate-200/80 shadow-sm">
      <View className="flex-row items-center flex-1 pr-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3 border border-slate-100"
          style={{ backgroundColor: (category?.color || '#3B82F6') + '20' }}
        >
          <Text className="text-xl">{category?.icon || '💳'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>
            {category?.name || 'Lain-lain'}
          </Text>
          <Text className="text-slate-400 text-[11px] mt-0.5">
            {formattedDate} {item.note ? `• ${item.note}` : ''}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <Text className={`${amountColor} font-black text-xs`}>
          {sign} Rp {item.amount.toLocaleString('id-ID')}
        </Text>
        <TouchableOpacity onPress={() => onPressDelete(item.id)} className="p-1">
          <Trash2 size={15} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

