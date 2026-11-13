import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useExpenseStore, TransactionType } from '../store/useExpenseStore';
import { ExpenseSource } from '../types/expense';
import { inputTypeConfigs } from '../constants/inputConfig';
import InputTypeTabs from './input/InputTypeTabs';
import InputAmountHero from './input/InputAmountHero';
import ExpenseSourceSelector from './input/ExpenseSourceSelector';
import CategoryPickerScreen from './input/CategoryPickerScreen';
import InputCategoryTileRow from './input/InputCategoryTileRow';
import InputNoteField from './input/InputNoteField';

type Props = { visible?: boolean; onClose?: () => void };

export default function BottomSheetInput({ visible, onClose }: Props) {
  const { categories, addExpense, isInputModalOpen, closeInputModal, inputInitialType, inputInitialCategoryId } =
    useExpenseStore();

  const isVisible = visible !== undefined ? visible : isInputModalOpen;
  const handleClose = () => { if (onClose) onClose(); closeInputModal(); };

  const [step, setStep] = useState<'form' | 'category'>('form');
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [source, setSource] = useState<ExpenseSource>('cash');
  const [isSavingLoan, setIsSavingLoan] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const type = inputInitialType || 'expense';
      setActiveType(type);
      setSource('cash');
      setIsSavingLoan(false);
      setStep('form');
      const firstCat = categories.find((c) => c.type === type);
      setSelectedCategoryId(inputInitialCategoryId || firstCat?.id || null);
    }
  }, [isVisible, inputInitialType, inputInitialCategoryId, categories]);

  const handleTypeChange = (t: TransactionType) => {
    setActiveType(t);
    const firstCat = categories.find((c) => c.type === t);
    setSelectedCategoryId(firstCat?.id || null);
  };

  const handleSave = async () => {
    const cleanAmount = parseInt(amount, 10);
    if (!cleanAmount || !selectedCategoryId) return;
    await addExpense(cleanAmount, selectedCategoryId, note, activeType, source, isSavingLoan);
    setAmount(''); setNote(''); handleClose();
  };

  const selectedCat = categories.find((c) => c.id === selectedCategoryId);
  const typeConfig = inputTypeConfigs[activeType];

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={handleClose}>
      {step === 'category' ? (
        <CategoryPickerScreen
          categories={categories}
          activeType={activeType}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onBack={() => setStep('form')}
        />
      ) : (
        <View className="flex-1 bg-white pt-12 px-5">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={handleClose} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 items-center justify-center">
              <X size={18} color="#0F172A" />
            </TouchableOpacity>
            <Text className="text-base font-extrabold text-slate-900">Catat Transaksi</Text>
            <View className="w-9" />
          </View>

          <InputTypeTabs activeType={activeType} onChangeType={handleTypeChange} />

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <InputAmountHero amount={amount} onChangeAmount={setAmount} activeType={activeType} />

            {activeType === 'expense' && (
              <ExpenseSourceSelector
                source={source}
                onSourceChange={setSource}
                isSavingLoan={isSavingLoan}
                onToggleSavingLoan={() => setIsSavingLoan((prev) => !prev)}
              />
            )}

            <InputCategoryTileRow selectedCategory={selectedCat} onPress={() => setStep('category')} />

            <InputNoteField note={note} onChangeNote={setNote} />

            <TouchableOpacity
              onPress={handleSave}
              disabled={!amount || !selectedCategoryId}
              className={`p-4 rounded-2xl flex-row items-center justify-center gap-2 ${amount && selectedCategoryId ? typeConfig.btnBg : 'bg-slate-200'}`}
              style={amount && selectedCategoryId ? { elevation: 3 } : undefined}
            >
              <Check size={18} color={amount && selectedCategoryId ? '#FFFFFF' : '#94A3B8'} strokeWidth={2.5} />
              <Text className={`font-black text-sm ${amount && selectedCategoryId ? 'text-white' : 'text-slate-400'}`}>
                {typeConfig.btnText}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}
