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
  } else if (item.source === 'saving') {
    amountColor = item.isSavingLoan ? 'text-amber-600' : 'text-sky-700';
  }

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes} WIB`;
    } catch {
      return '';
    }
  };

  const isLoan = item.type === 'expense' && item.source === 'saving' && item.isSavingLoan;
  const isSavingSpent = item.type === 'expense' && item.source === 'saving' && !item.isSavingLoan;

  return (
    <View className="flex-row justify-between items-center bg-white p-3.5 rounded-2xl mb-2 border border-slate-200/80">
      <View className="flex-row items-center flex-1 pr-3">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3 border border-slate-100"
          style={{ backgroundColor: (category?.color || '#3B82F6') + '20' }}
        >
          <Text className="text-xl">{category?.icon || '💳'}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text className="text-slate-800 font-bold text-xs" numberOfLines={1}>
              {category?.name || 'Lain-lain'}
            </Text>
            {isLoan && (
              <View className="bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-md">
                <Text className="text-[8px] font-extrabold text-amber-800">Pinjam Tabungan</Text>
              </View>
            )}
            {isSavingSpent && (
              <View className="bg-sky-100 border border-sky-300 px-1.5 py-0.5 rounded-md">
                <Text className="text-[8px] font-extrabold text-sky-800">Tabungan</Text>
              </View>
            )}
          </View>
          <Text className="text-slate-400 text-[10px] font-medium mt-0.5">
            {formatTime(item.date)} {item.note ? `• ${item.note}` : ''}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-3">
        <Text className={`${amountColor} font-black text-xs`}>
          {sign} Rp {item.amount.toLocaleString('id-ID')}
        </Text>
        <TouchableOpacity onPress={() => onPressDelete(item.id)} className="p-1">
          <Trash2 size={14} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
