import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Pressable } from 'react-native';
import { useExpenseStore, TransactionType } from '../store/useExpenseStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function BottomSheetInput({ visible, onClose }: Props) {
  const { categories, addExpense } = useExpenseStore();
  
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type);
    setSelectedCategoryId(null);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategoryId) return;
    
    // Parse amount, buang semua karakter non-angka
    const cleanAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    await addExpense(cleanAmount, selectedCategoryId, note, activeType);
    
    // Reset form
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    Keyboard.dismiss();
    onClose();
  };

  // Filter kategori berdasarkan tipe yang sedang aktif
  const filteredCategories = categories.filter(c => c.type === activeType);

  // Tema warna dinamis berdasarkan tipe transaksi
  const typeConfig = {
    expense: {
      title: 'Catat Pengeluaran',
      accentColor: '#F43F5E', // rose-500
      activeTabBg: 'bg-rose-500/20 border-rose-500',
      activeTabText: 'text-rose-400',
      selectedCatStyle: 'border-rose-500 bg-rose-500/20',
      btnBg: 'bg-rose-600 active:bg-rose-700',
      btnText: 'Simpan Pengeluaran',
      notePlaceholder: 'Makan siang, bensin, belanja bulanan...',
    },
    income: {
      title: 'Catat Pemasukan',
      accentColor: '#10B981', // emerald-500
      activeTabBg: 'bg-emerald-500/20 border-emerald-500',
      activeTabText: 'text-emerald-400',
      selectedCatStyle: 'border-emerald-500 bg-emerald-500/20',
      btnBg: 'bg-emerald-600 active:bg-emerald-700',
      btnText: 'Simpan Pemasukan',
      notePlaceholder: 'Gaji kantor, hasil freelance, bonus...',
    },
    saving: {
      title: 'Catat Tabungan / Investasi',
      accentColor: '#3B82F6', // blue-500
      activeTabBg: 'bg-blue-500/20 border-blue-500',
      activeTabText: 'text-blue-400',
      selectedCatStyle: 'border-blue-500 bg-blue-500/20',
      btnBg: 'bg-blue-600 active:bg-blue-700',
      btnText: 'Simpan Tabungan',
      notePlaceholder: 'Setor dana darurat, beli reksadana, tabungan impian...',
    },
  }[activeType];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable 
          className="absolute inset-0 bg-black/60" 
          onPress={onClose} 
        />
        
        <View className="bg-zinc-900 rounded-t-3xl pt-2 pb-10 px-6 w-full" style={{ height: '88%' }}>
          {/* Handle bar */}
          <View className="w-12 h-1.5 bg-zinc-600 rounded-full self-center mb-4" />
          
          {/* Segmented Tab: Pengeluaran / Pemasukan / Tabungan */}
          <View className="flex-row bg-zinc-800 p-1 rounded-2xl mb-5">
            <TouchableOpacity 
              onPress={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'expense' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text className={`font-bold text-xs ${activeType === 'expense' ? 'text-rose-400' : 'text-zinc-400'}`}>
                🔴 Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'income' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text className={`font-bold text-xs ${activeType === 'income' ? 'text-emerald-400' : 'text-zinc-400'}`}>
                🟢 Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleTypeChange('saving')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'saving' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text className={`font-bold text-xs ${activeType === 'saving' ? 'text-blue-400' : 'text-zinc-400'}`}>
                🔵 Tabungan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Nominal */}
          <View className="bg-zinc-800 rounded-2xl px-4 py-3 mb-5">
            <Text className="text-zinc-400 text-xs mb-1">Nominal (Rp)</Text>
            <TextInput
              className="text-white text-3xl font-bold"
              placeholder="0"
              placeholderTextColor="#52525B"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          {/* Pilih Kategori */}
          <Text className="text-white font-bold mb-3">Pilih Kategori</Text>
          <ScrollView className="mb-4 flex-1" showsVerticalScrollIndicator={false}>
            {Object.entries(
              filteredCategories.reduce((acc, cat) => {
                if (!acc[cat.group]) acc[cat.group] = [];
                acc[cat.group].push(cat);
                return acc;
              }, {} as Record<string, typeof filteredCategories>)
            ).map(([groupName, groupCats]) => (
              <View key={groupName} className="mb-4">
                <Text className="text-zinc-500 text-xs mb-2 font-bold uppercase">{groupName}</Text>
                <View className="flex-row flex-wrap">
                  {groupCats.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        className={`items-center justify-center p-2 rounded-2xl mr-2 mb-2 border-2 ${
                          isSelected ? typeConfig.selectedCatStyle : 'border-zinc-800 bg-zinc-800'
                        }`}
                        style={{ width: '22%', minWidth: 70, height: 75 }}
                      >
                        <Text className="text-2xl mb-1">{cat.icon}</Text>
                        <Text className="text-zinc-300 text-[10px] text-center" numberOfLines={1}>
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Catatan Opsional */}
          <View className="bg-zinc-800 rounded-2xl px-4 py-3 mb-5">
            <Text className="text-zinc-400 text-xs mb-1">Catatan (Opsional)</Text>
            <TextInput
              className="text-white text-base"
              placeholder={typeConfig.notePlaceholder}
              placeholderTextColor="#52525B"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity 
            onPress={handleSave}
            disabled={!amount || !selectedCategoryId}
            className={`p-4 rounded-full items-center ${
              amount && selectedCategoryId ? typeConfig.btnBg : 'bg-zinc-800'
            }`}
          >
            <Text className={`font-bold text-lg ${amount && selectedCategoryId ? 'text-white' : 'text-zinc-500'}`}>
              {typeConfig.btnText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
