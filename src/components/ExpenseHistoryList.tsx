import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { ReceiptText, Trash2 } from 'lucide-react-native';
import { Expense, Category } from '../store/useExpenseStore';

type Props = {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
};

export default function ExpenseHistoryList({
  expenses,
  categories,
  onDeleteExpense,
}: Props) {
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

  const confirmDelete = (id: string) => {
    Alert.alert(
      'Hapus Transaksi',
      'Apakah Anda yakin ingin menghapus catatan transaksi ini?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: () => onDeleteExpense(id) },
      ]
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Transaksi Hari Ini
        </Text>
        <Text className="text-[10px] text-slate-400 font-bold">
          {expenses.length} Transaksi
        </Text>
      </View>

      {expenses.length === 0 ? (
        <View className="bg-white border border-slate-200/90 p-8 rounded-3xl items-center justify-center shadow-sm">
          <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center mb-3">
            <ReceiptText size={22} color="#94A3B8" />
          </View>
          <Text className="text-slate-800 font-bold text-sm mb-1">
            Belum ada transaksi hari ini
          </Text>
          <Text className="text-slate-400 text-xs text-center leading-relaxed">
            Tekan tombol (+) atau tombol cepat di atas untuk mulai mencatat pengeluaran, pemasukan, atau tabungan.
          </Text>
        </View>
      ) : (
        expenses.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId);

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

          const timeText = formatTime(item.date);

          return (
            <View
              key={item.id}
              className="bg-white border border-slate-200/80 p-3.5 rounded-2xl flex-row items-center justify-between shadow-sm mb-2.5"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center mr-3 border ${badgeBg}`}
                >
                  <Text className="text-xl">{category?.icon || '💳'}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-xs font-bold text-slate-800"
                    numberOfLines={1}
                  >
                    {item.note || category?.name || 'Transaksi'}
                  </Text>
                  <Text className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {typeLabel} • {timeText}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <Text className={`${amountColor} font-black text-xs`}>
                  {sign} Rp {item.amount.toLocaleString('id-ID')}
                </Text>

                <TouchableOpacity
                  onPress={() => confirmDelete(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  className="p-1"
                >
                  <Trash2 size={15} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
