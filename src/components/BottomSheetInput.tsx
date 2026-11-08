import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, Modal, Pressable } from 'react-native';
import { useExpenseStore, TransactionType } from '../store/useExpenseStore';
import { inputTypeConfigs } from '../constants/inputConfig';
import InputTypeTabs from './input/InputTypeTabs';
import InputCategorySelector from './input/InputCategorySelector';

type Props = { visible?: boolean; onClose?: () => void };

export default function BottomSheetInput({ visible, onClose }: Props) {
  const { categories, addExpense, isInputModalOpen, closeInputModal, inputInitialType, inputInitialCategoryId } =
    useExpenseStore();

  const isVisible = visible !== undefined ? visible : isInputModalOpen;
  const handleClose = () => { if (onClose) onClose(); closeInputModal(); };

  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      if (inputInitialType) setActiveType(inputInitialType);
      if (inputInitialCategoryId) setSelectedCategoryId(inputInitialCategoryId);
    }
  }, [isVisible, inputInitialType, inputInitialCategoryId]);

  const handleSave = async () => {
    if (!amount || !selectedCategoryId) return;
    const cleanAmount = parseInt(amount, 10);
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    await addExpense(cleanAmount, selectedCategoryId, note, activeType);
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    Keyboard.dismiss();
    handleClose();
  };

  const typeConfig = inputTypeConfigs[activeType];
  const formattedAmount = amount ? parseInt(amount, 10).toLocaleString('id-ID') : '';

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-slate-900/60" onPress={handleClose} />
        <View className="bg-white rounded-t-[36px] pt-3 pb-8 px-6 w-full shadow-2xl" style={{ height: '88%' }}>
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

          <InputTypeTabs activeType={activeType} onChangeType={(t) => { setActiveType(t); setSelectedCategoryId(null); }} />

          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-slate-400 text-xs mb-1 font-semibold">Nominal (Rp)</Text>
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-2xl font-bold mr-1">Rp</Text>
              <TextInput
                className="text-slate-900 text-3xl font-black flex-1 p-0"
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formattedAmount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
              />
            </View>
          </View>

          <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-2.5">Pilih Kategori</Text>
          <InputCategorySelector
            categories={categories}
            activeType={activeType}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />

          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-slate-400 text-xs mb-1 font-semibold">Catatan (Opsional)</Text>
            <TextInput
              className="text-slate-800 text-sm font-semibold p-0"
              placeholder={typeConfig.notePlaceholder}
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!amount || !selectedCategoryId}
            className={`p-4 rounded-2xl items-center ${amount && selectedCategoryId ? typeConfig.btnBg : 'bg-slate-200'}`}
            style={amount && selectedCategoryId ? { elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 } : undefined}
          >
            <Text className={`font-black text-base ${amount && selectedCategoryId ? 'text-white' : 'text-slate-400'}`}>
              {typeConfig.btnText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
