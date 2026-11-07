import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Search, X, FileSearch } from 'lucide-react-native';
import { Expense, Category } from '../types/expense';
import SearchResultItem from './search/SearchResultItem';

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
  const trimmed = query.trim().toLowerCase();

  const filteredResults = trimmed
    ? expenses.filter((e) => {
        const cat = categories.find((c) => c.id === e.categoryId);
        const catName = cat?.name.toLowerCase() || '';
        const note = (e.note || '').toLowerCase();
        const amountStr = e.amount.toString();
        return catName.includes(trimmed) || note.includes(trimmed) || amountStr.includes(trimmed);
      })
    : [];

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-slate-900/60 justify-end">
        <View className="bg-white rounded-t-[36px] pt-3 pb-8 px-5 w-full shadow-2xl" style={{ height: '85%' }}>
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

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
            <TouchableOpacity onPress={handleClose} className="px-3 py-2.5 rounded-xl border border-slate-200">
              <Text className="text-xs text-slate-600 font-bold">Tutup</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {!trimmed ? (
              <View className="py-16 items-center justify-center">
                <View className="w-12 h-12 rounded-2xl bg-slate-100 items-center justify-center mb-3">
                  <FileSearch size={22} color="#94A3B8" />
                </View>
                <Text className="text-slate-800 font-bold text-sm mb-1">Cari Catatan Keuangan</Text>
                <Text className="text-slate-400 text-xs text-center">
                  Ketik kata kunci seperti "kopi", "gaji", atau nominal angka.
                </Text>
              </View>
            ) : filteredResults.length === 0 ? (
              <View className="py-16 items-center justify-center">
                <Text className="text-slate-500 font-bold text-sm">Tidak ditemukan hasil untuk "{query}"</Text>
                <Text className="text-slate-400 text-xs mt-1">Coba kata kunci lain atau periksa ejaan.</Text>
              </View>
            ) : (
              <>
                <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
                  Ditemukan {filteredResults.length} Transaksi
                </Text>
                {filteredResults.map((item) => (
                  <SearchResultItem
                    key={item.id}
                    item={item}
                    category={categories.find((c) => c.id === item.categoryId)}
                  />
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
