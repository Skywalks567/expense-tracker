import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white font-bold text-xl">Daftar Transaksi</Text>
        <Text className="text-zinc-500 text-xs font-semibold">{transactions.length} transaksi</Text>
      </View>

      {/* Filter Pill */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <TouchableOpacity 
            onPress={() => onFilterChange('all')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'all' ? 'bg-zinc-100 border-zinc-100' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <Text className={`text-xs font-bold ${filterType === 'all' ? 'text-zinc-950' : 'text-zinc-400'}`}>
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onFilterChange('expense')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'expense' ? 'bg-rose-500/20 border-rose-500' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <Text className={`text-xs font-bold ${filterType === 'expense' ? 'text-rose-400' : 'text-zinc-400'}`}>
              🔴 Pengeluaran
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onFilterChange('income')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'income' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <Text className={`text-xs font-bold ${filterType === 'income' ? 'text-emerald-400' : 'text-zinc-400'}`}>
              🟢 Pemasukan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => onFilterChange('saving')}
            className={`px-4 py-2 rounded-2xl border ${
              filterType === 'saving' ? 'bg-blue-500/20 border-blue-500' : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <Text className={`text-xs font-bold ${filterType === 'saving' ? 'text-blue-400' : 'text-zinc-400'}`}>
              🔵 Tabungan
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* List Transaksi */}
      {transactions.length === 0 ? (
        <View className="bg-zinc-900/60 p-8 rounded-3xl items-center justify-center border border-zinc-800/60">
          <Text className="text-zinc-500 text-sm">Tidak ada transaksi pada filter ini.</Text>
        </View>
      ) : (
        transactions.map((item) => {
          const category = categories.find(c => c.id === item.categoryId);
          const isIncome = item.type === 'income';
          const isSaving = item.type === 'saving';

          let sign = '-';
          let amountColor = 'text-rose-400';
          if (isIncome) {
            sign = '+';
            amountColor = 'text-emerald-400';
          } else if (isSaving) {
            sign = '';
            amountColor = 'text-blue-400';
          }

          // Format tanggal (misal: "29 Okt, 14:30")
          const itemDate = new Date(item.date);
          const formattedDate = !isNaN(itemDate.getTime()) 
            ? `${itemDate.getDate()} ${itemDate.toLocaleDateString('id-ID', { month: 'short' })}`
            : '';

          return (
            <View 
              key={item.id} 
              className="flex-row justify-between items-center bg-zinc-900/90 p-4 rounded-2xl mb-2.5 border border-zinc-800"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View 
                  className="w-11 h-11 rounded-2xl items-center justify-center mr-3"
                  style={{ backgroundColor: (category?.color || '#3B82F6') + '25' }}
                >
                  <Text className="text-xl">{category?.icon || '💳'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-sm" numberOfLines={1}>
                    {category?.name || 'Lain-lain'}
                  </Text>
                  <Text className="text-zinc-500 text-xs mt-0.5">
                    {formattedDate} {item.note ? `• ${item.note}` : ''}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className={`${amountColor} font-bold text-sm`}>
                  {sign} Rp {item.amount.toLocaleString('id-ID')}
                </Text>
                <TouchableOpacity 
                  onPress={() => onDeleteExpense(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text className="text-zinc-600 text-[11px] mt-1 underline">Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
