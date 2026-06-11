import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Pressable } from 'react-native';
import { useExpenseStore } from '../store/useExpenseStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function BottomSheetInput({ visible, onClose }: Props) {
  const { categories, addExpense } = useExpenseStore();
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!amount || !selectedCategoryId) return;
    
    // Parse amount, buang semua karakter non-angka
    const cleanAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(cleanAmount)) return;

    await addExpense(cleanAmount, selectedCategoryId, note);
    
    // Reset form
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    Keyboard.dismiss();
    onClose();
  };

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
        
        <View className="bg-zinc-900 rounded-t-3xl pt-2 pb-10 px-6 w-full" style={{ height: '85%' }}>
          <View className="w-12 h-1.5 bg-zinc-600 rounded-full self-center mb-6" />
          <Text className="text-white text-xl font-bold mb-6 text-center">Catat Pengeluaran</Text>
          
          <View className="bg-zinc-800 rounded-2xl px-4 py-3 mb-6">
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

        <Text className="text-white font-bold mb-3">Pilih Kategori</Text>
        <ScrollView className="mb-6 flex-1" showsVerticalScrollIndicator={false}>
          {Object.entries(
            categories.reduce((acc, cat) => {
              if (!acc[cat.group]) acc[cat.group] = [];
              acc[cat.group].push(cat);
              return acc;
            }, {} as Record<string, typeof categories>)
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
                        isSelected ? 'border-blue-500 bg-blue-500/20' : 'border-zinc-800 bg-zinc-800'
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

        <View className="bg-zinc-800 rounded-2xl px-4 py-3 mb-8">
          <Text className="text-zinc-400 text-xs mb-1">Catatan (Opsional)</Text>
          <TextInput
              className="text-white text-base"
            placeholder="Makan siang bersama teman..."
            placeholderTextColor="#52525B"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity 
          onPress={handleSave}
          disabled={!amount || !selectedCategoryId}
          className={`p-4 rounded-full items-center ${
            amount && selectedCategoryId ? 'bg-blue-600 active:bg-blue-700' : 'bg-zinc-800'
          }`}
        >
          <Text className={`font-bold text-lg ${amount && selectedCategoryId ? 'text-white' : 'text-zinc-500'}`}>
            Simpan Catatan
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
