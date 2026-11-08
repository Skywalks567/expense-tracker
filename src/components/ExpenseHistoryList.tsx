import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ReceiptText, ArrowRight } from 'lucide-react-native';
import { Expense, Category } from '../types/expense';
import DeleteConfirmModal from './history/DeleteConfirmModal';
import TransactionHistoryItem from './history/TransactionHistoryItem';

type Props = {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
  onViewAll?: () => void;
};

export default function ExpenseHistoryList({
  expenses,
  categories,
  onDeleteExpense,
  onViewAll,
}: Props) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteExpense(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const displayedExpenses = expenses.slice(0, 3);
  const hasMore = expenses.length > 3;

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Transaksi Hari Ini
        </Text>
        <Text className="text-[10px] text-slate-400 font-bold">{expenses.length} Transaksi</Text>
      </View>

      {expenses.length === 0 ? (
        <View className="bg-white border border-slate-200/90 p-8 rounded-3xl items-center justify-center shadow-sm">
          <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center mb-3">
            <ReceiptText size={22} color="#94A3B8" />
          </View>
          <Text className="text-slate-800 font-bold text-sm mb-1">Belum ada transaksi hari ini</Text>
          <Text className="text-slate-400 text-xs text-center leading-relaxed">
            Tekan tombol (+) di bawah untuk mulai mencatat pengeluaran, pemasukan, atau tabungan.
          </Text>
        </View>
      ) : (
        <>
          {displayedExpenses.map((item) => (
            <TransactionHistoryItem
              key={item.id}
              item={item}
              category={categories.find((c) => c.id === item.categoryId)}
              onPressDelete={setDeleteTargetId}
            />
          ))}

          {hasMore && onViewAll && (
            <TouchableOpacity
              onPress={onViewAll}
              activeOpacity={0.7}
              className="bg-white border border-slate-200/90 py-3 px-4 rounded-2xl flex-row items-center justify-center gap-2 mt-1 shadow-sm"
            >
              <Text className="text-xs font-bold text-indigo-600">
                Lihat Semua Transaksi Hari Ini ({expenses.length})
              </Text>
              <ArrowRight size={14} color="#4F46E5" />
            </TouchableOpacity>
          )}
        </>
      )}

      <DeleteConfirmModal
        visible={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
