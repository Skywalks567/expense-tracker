import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Expense, Category } from '../../types/expense';

type Props = {
  item: Expense;
  category?: Category;
  onPressDelete: (id: string) => void;
};

export default function TransactionHistoryItem({
  item,
  category,
  onPressDelete,
}: Props) {
  const isIncome = item.type === 'income';
  const isSaving = item.type === 'saving';

  let sign = '-';
  let amountColor = 'text-rose-600';
  let typeLabel = 'Pengeluaran';
  let badgeBg = 'bg-rose-50 border-rose-100';

  if (isIncome) {
    sign = '+';
    amountColor = 'text-emerald-600';
    typeLabel = 'Pemasukan';
    badgeBg = 'bg-emerald-50 border-emerald-100';
  } else if (isSaving) {
    sign = '';
    amountColor = 'text-sky-600';
    typeLabel = 'Tabungan';
    badgeBg = 'bg-sky-50 border-sky-100';
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

  return (
    <View className="bg-white border border-slate-200/80 p-3.5 rounded-2xl flex-row items-center justify-between shadow-sm mb-2.5">
      <View className="flex-row items-center flex-1 pr-3">
        <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3 border ${badgeBg}`}>
          <Text className="text-xl">{category?.icon || '💳'}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold text-slate-800" numberOfLines={1}>
            {item.note || category?.name || 'Transaksi'}
          </Text>
          <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
            {typeLabel} • {formatTime(item.date)}
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

