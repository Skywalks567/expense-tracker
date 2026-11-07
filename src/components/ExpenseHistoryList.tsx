import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { ReceiptText, Trash2, ArrowRight, AlertTriangle } from 'lucide-react-native';
import { Expense, Category } from '../store/useExpenseStore';

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

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteExpense(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Batasi hanya maksimal 3 transaksi terbaru hari ini
  const displayedExpenses = expenses.slice(0, 3);
  const hasMore = expenses.length > 3;

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
            Tekan tombol (+) di bawah untuk mulai mencatat pengeluaran, pemasukan, atau tabungan.
          </Text>
        </View>
      ) : (
        <>
          {displayedExpenses.map((item) => {
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
                    onPress={() => setDeleteTargetId(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    className="p-1"
                  >
                    <Trash2 size={15} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* Tombol Lihat Semua Transaksi (Jika lebih dari 3) */}
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

      {/* Modal Konfirmasi Hapus (Universal Support Android, iOS, Web) */}
      <Modal
        visible={!!deleteTargetId}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTargetId(null)}
      >
        <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
          <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 items-center justify-center">
                <AlertTriangle size={20} color="#E11D48" />
              </View>
              <Text className="text-slate-900 text-base font-extrabold">
                Hapus Transaksi?
              </Text>
            </View>

            <Text className="text-slate-500 text-xs mb-5">
              Catatan transaksi ini akan dihapus secara permanen dan saldo akan diperbarui.
            </Text>

            <View className="flex-row justify-end gap-2.5">
              <TouchableOpacity
                onPress={() => setDeleteTargetId(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200"
              >
                <Text className="text-xs text-slate-500 font-bold">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="bg-rose-600 px-5 py-2.5 rounded-xl shadow-sm"
              >
                <Text className="text-white text-xs font-bold">Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
