import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Expense, Category, TransactionType } from '../../store/useExpenseStore';

type Props = {
  transactions: Expense[];
  categories: Category[];
  filterType: 'all' | TransactionType;
  onFilterChange: (type: 'all' | TransactionType) => void;
  onDeleteExpense: (id: string) => void;
};

export default function MonthlyTransactionList({
  transactions,
  categories,
  filterType,
  onFilterChange,
  onDeleteExpense,
}: Props) {
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
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">
          Daftar Transaksi
        </Text>
        <Text className="text-slate-400 text-xs font-semibold">
          {transactions.length} transaksi
        </Text>
      </View>

      {/* Filter Pill */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'all'
                ? 'bg-indigo-600 border-indigo-600'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filterType === 'all' ? 'text-white' : 'text-slate-600'
              }`}
            >
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onFilterChange('expense')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'expense'
                ? 'bg-rose-50 border-rose-300'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filterType === 'expense' ? 'text-rose-600' : 'text-slate-600'
              }`}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onFilterChange('income')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'income'
                ? 'bg-emerald-50 border-emerald-300'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filterType === 'income' ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              Pemasukan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onFilterChange('saving')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'saving'
                ? 'bg-sky-50 border-sky-300'
                : 'bg-white border-slate-200'
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                filterType === 'saving' ? 'text-sky-600' : 'text-slate-600'
              }`}
            >
              Tabungan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* List Transaksi */}
      {transactions.length === 0 ? (
        <View className="bg-white p-8 rounded-3xl items-center justify-center border border-slate-200/90 shadow-sm">
          <Text className="text-slate-400 text-xs font-bold">
            Tidak ada transaksi pada filter ini.
          </Text>
        </View>
      ) : (
        transactions.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId);
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
            ? `${itemDate.getDate()} ${itemDate.toLocaleDateString('id-ID', {
                month: 'short',
              })}`
            : '';

          return (
            <View
              key={item.id}
              className="flex-row justify-between items-center bg-white p-4 rounded-2xl mb-2.5 border border-slate-200/80 shadow-sm"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3 border border-slate-100"
                  style={{ backgroundColor: (category?.color || '#3B82F6') + '20' }}
                >
                  <Text className="text-xl">{category?.icon || '💳'}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-slate-800 font-bold text-xs"
                    numberOfLines={1}
                  >
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
