import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Search, X, FileSearch } from 'lucide-react-native';
import { Expense, Category } from '../store/useExpenseStore';

type Props = {
  visible: boolean;
  onClose: () => void;
  expenses: Expense[];
  categories: Category[];
};

export default function QuickSearchModal({
  visible,
  onClose,
  expenses,
  categories,
}: Props) {
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim().toLowerCase();

  const filteredResults = trimmedQuery
    ? expenses.filter((e) => {
        const cat = categories.find((c) => c.id === e.categoryId);
        const catName = cat?.name.toLowerCase() || '';
        const note = (e.note || '').toLowerCase();
        const amountStr = e.amount.toString();

        return (
          catName.includes(trimmedQuery) ||
          note.includes(trimmedQuery) ||
          amountStr.includes(trimmedQuery)
        );
      })
    : [];

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-slate-900/60 justify-end">
        <View
          className="bg-white rounded-t-[36px] pt-3 pb-8 px-5 w-full shadow-2xl"
          style={{ height: '85%' }}
        >
          {/* Handle bar */}
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

          {/* Header & Search Input */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center gap-2.5">
              <Search size={18} color="#64748B" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Cari transaksi, kategori, atau nominal..."
                placeholderTextColor="#94A3B8"
                autoFocus
                className="flex-1 text-slate-800 text-sm font-semibold p-0"
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} className="p-1">
                  <X size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={handleClose}
              className="px-3 py-2.5 rounded-xl border border-slate-200"
            >
              <Text className="text-xs text-slate-600 font-bold">Tutup</Text>
            </TouchableOpacity>
          </View>

          {/* Search Result List */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {!trimmedQuery ? (
              <View className="py-16 items-center justify-center">
                <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center mb-3">
                  <FileSearch size={22} color="#94A3B8" />
                </View>
                <Text className="text-slate-800 font-bold text-sm mb-1">
                  Cari Catatan Keuangan
                </Text>
                <Text className="text-slate-400 text-xs text-center">
                  Ketik kata kunci seperti "kopi", "gaji", atau nominal angka.
                </Text>
              </View>
            ) : filteredResults.length === 0 ? (
              <View className="py-16 items-center justify-center">
                <Text className="text-slate-500 font-bold text-sm">
                  Tidak ditemukan hasil untuk "{query}"
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  Coba kata kunci lain atau periksa ejaan.
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                  Ditemukan {filteredResults.length} Transaksi
                </Text>

                {filteredResults.map((item) => {
                  const category = categories.find((c) => c.id === item.categoryId);
                  const isIncome = item.type === 'income';
                  const isSaving = item.type === 'saving';

                  let sign = '-';
                  let amountColor = 'text-rose-600';
                  let badgeBg = 'bg-rose-50 border-rose-100';

                  if (isIncome) {
                    sign = '+';
                    amountColor = 'text-emerald-600';
                    badgeBg = 'bg-emerald-50 border-emerald-100';
                  } else if (isSaving) {
                    sign = '';
                    amountColor = 'text-sky-600';
                    badgeBg = 'bg-sky-50 border-sky-100';
                  }

                  return (
                    <View
                      key={item.id}
                      className="bg-white border border-slate-200/80 p-3.5 rounded-2xl flex-row items-center justify-between shadow-sm mb-2"
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
                            {formatDate(item.date)} • {category?.name}
                          </Text>
                        </View>
                      </View>

                      <Text className={`${amountColor} font-black text-xs`}>
                        {sign} Rp {item.amount.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  );
                })}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

