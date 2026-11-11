import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Expense, Category, TransactionType } from '../../types/expense';
import ReportFilterPills from './ReportFilterPills';
import ReportTransactionItem from './ReportTransactionItem';
import DeleteConfirmModal from '../history/DeleteConfirmModal';

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
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteExpense(deleteTargetId);
      setDeleteTargetId(null);
    }
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

      <ReportFilterPills filterType={filterType} onFilterChange={onFilterChange} />

      {transactions.length === 0 ? (
        <View className="bg-white p-8 rounded-3xl items-center justify-center border border-slate-200/90" style={{ elevation: 1 }}>
          <Text className="text-slate-400 text-xs font-bold">
            Tidak ada transaksi pada filter ini.
          </Text>
        </View>
      ) : (
        transactions.map((item) => (
          <ReportTransactionItem
            key={item.id}
            item={item}
            category={categories.find((c) => c.id === item.categoryId)}
            onPressDelete={setDeleteTargetId}
          />
        ))
      )}

      <DeleteConfirmModal
        visible={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
