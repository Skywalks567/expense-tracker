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

  const formatDateHeader = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) return 'Hari Ini';
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
      return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const grouped = transactions.reduce<Record<string, Expense[]>>((acc, item) => {
    const key = item.date.substring(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-slate-800 font-extrabold text-sm uppercase tracking-wider">
          Daftar Transaksi
        </Text>
        <Text className="text-slate-400 text-xs font-semibold">{transactions.length} transaksi</Text>
      </View>

      <ReportFilterPills filterType={filterType} onFilterChange={onFilterChange} />

      {sortedDates.length === 0 ? (
        <View className="bg-white p-8 rounded-3xl items-center justify-center border border-slate-200/90" style={{ elevation: 1 }}>
          <Text className="text-slate-400 text-xs font-bold">Tidak ada transaksi pada filter ini.</Text>
        </View>
      ) : (
        sortedDates.map((dateKey) => (
          <View key={dateKey} className="mb-3">
            <View className="flex-row items-center justify-between mb-1.5 px-1">
              <Text className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {formatDateHeader(dateKey)}
              </Text>
              <Text className="text-[9px] text-slate-400 font-bold">{grouped[dateKey].length} transaksi</Text>
            </View>

            {grouped[dateKey].map((item) => (
              <ReportTransactionItem
                key={item.id}
                item={item}
                category={categories.find((c) => c.id === item.categoryId)}
                onPressDelete={setDeleteTargetId}
              />
            ))}
          </View>
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
