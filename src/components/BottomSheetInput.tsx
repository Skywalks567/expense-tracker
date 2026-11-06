import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useExpenseStore, TransactionType } from '../store/useExpenseStore';

type Props = {
  visible?: boolean;
  onClose?: () => void;
};

export default function BottomSheetInput({ visible, onClose }: Props) {
  const {
    categories,
    addExpense,
    isInputModalOpen,
    closeInputModal,
    inputInitialType,
    inputInitialCategoryId,
  } = useExpenseStore();

  const isVisible = visible !== undefined ? visible : isInputModalOpen;
  const handleClose = () => {
    if (onClose) onClose();
    closeInputModal();
  };

  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Sinkronisasi tipe awal & kategori ketika modal terbuka
  useEffect(() => {
    if (isVisible) {
      if (inputInitialType) setActiveType(inputInitialType);
      if (inputInitialCategoryId) setSelectedCategoryId(inputInitialCategoryId);
    }
  }, [isVisible, inputInitialType, inputInitialCategoryId]);

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type);
    setSelectedCategoryId(null);
  };

  const formatDisplayAmount = (raw: string) => {
    const clean = raw.replace(/[^0-9]/g, '');
    if (!clean) return '';
    return parseInt(clean, 10).toLocaleString('id-ID');
  };

  const handleAmountChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    setAmount(clean);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategoryId) return;

    const cleanAmount = parseInt(amount, 10);
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    await addExpense(cleanAmount, selectedCategoryId, note, activeType);

    // Reset form
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    Keyboard.dismiss();
    handleClose();
  };

  const filteredCategories = categories.filter((c) => c.type === activeType);

  const typeConfig = {
    expense: {
      title: 'Catat Pengeluaran',
      activeTabBg: 'bg-white border-rose-200 shadow-sm',
      activeTabText: 'text-rose-600',
      selectedCatStyle: 'border-rose-500 bg-rose-50',
      btnBg: 'bg-rose-600 active:bg-rose-700 shadow-rose-200',
      btnText: 'Simpan Pengeluaran',
      notePlaceholder: 'Makan siang, bensin, belanja bulanan...',
    },
    income: {
      title: 'Catat Pemasukan',
      activeTabBg: 'bg-white border-emerald-200 shadow-sm',
      activeTabText: 'text-emerald-600',
      selectedCatStyle: 'border-emerald-500 bg-emerald-50',
      btnBg: 'bg-emerald-600 active:bg-emerald-700 shadow-emerald-200',
      btnText: 'Simpan Pemasukan',
      notePlaceholder: 'Gaji kantor, hasil freelance, bonus...',
    },
    saving: {
      title: 'Catat Tabungan / Investasi',
      activeTabBg: 'bg-white border-sky-200 shadow-sm',
      activeTabText: 'text-sky-600',
      selectedCatStyle: 'border-sky-500 bg-sky-50',
      btnBg: 'bg-sky-600 active:bg-sky-700 shadow-sky-200',
      btnText: 'Simpan Tabungan',
      notePlaceholder: 'Setor dana darurat, beli reksadana, tabungan impian...',
    },
  }[activeType];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-slate-900/60" onPress={handleClose} />

        <View
          className="bg-white rounded-t-[36px] pt-3 pb-8 px-6 w-full shadow-2xl"
          style={{ height: '88%' }}
        >
          {/* Handle bar */}
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-4" />

          {/* Segmented Tab: Pengeluaran / Pemasukan / Tabungan */}
          <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200/80">
            <TouchableOpacity
              onPress={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'expense' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text
                className={`font-extrabold text-xs ${
                  activeType === 'expense' ? 'text-rose-600' : 'text-slate-500'
                }`}
              >
                Pengeluaran
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'income' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text
                className={`font-extrabold text-xs ${
                  activeType === 'income' ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                Pemasukan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTypeChange('saving')}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                activeType === 'saving' ? typeConfig.activeTabBg : 'border-transparent'
              }`}
            >
              <Text
                className={`font-extrabold text-xs ${
                  activeType === 'saving' ? 'text-sky-600' : 'text-slate-500'
                }`}
              >
                Tabungan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Nominal */}
          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-slate-400 text-xs mb-1 font-semibold">
              Nominal (Rp)
            </Text>
            <View className="flex-row items-center">
              <Text className="text-slate-400 text-2xl font-bold mr-1">Rp</Text>
              <TextInput
                className="text-slate-900 text-3xl font-black flex-1 p-0"
                placeholder="0"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formatDisplayAmount(amount)}
                onChangeText={handleAmountChange}
              />
            </View>
          </View>

          {/* Pilih Kategori */}
          <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-2.5">
            Pilih Kategori
          </Text>
          <ScrollView className="mb-4 flex-1" showsVerticalScrollIndicator={false}>
            {Object.entries(
              filteredCategories.reduce((acc, cat) => {
                if (!acc[cat.group]) acc[cat.group] = [];
                acc[cat.group].push(cat);
                return acc;
              }, {} as Record<string, typeof filteredCategories>)
            ).map(([groupName, groupCats]) => (
              <View key={groupName} className="mb-4">
                <Text className="text-slate-400 text-[10px] mb-2 font-extrabold uppercase tracking-wider">
                  {groupName}
                </Text>
                <View className="flex-row flex-wrap">
                  {groupCats.map((cat) => {
                    const isSelected = selectedCategoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        onPress={() => setSelectedCategoryId(cat.id)}
                        className={`items-center justify-center p-2 rounded-2xl mr-2 mb-2 border-2 ${
                          isSelected
                            ? typeConfig.selectedCatStyle
                            : 'border-slate-200 bg-slate-50'
                        }`}
                        style={{ width: '22%', minWidth: 70, height: 75 }}
                      >
                        <Text className="text-2xl mb-1">{cat.icon}</Text>
                        <Text
                          className="text-slate-700 text-[10px] font-bold text-center"
                          numberOfLines={1}
                        >
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
          <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
            <Text className="text-slate-400 text-xs mb-1 font-semibold">
              Catatan (Opsional)
            </Text>
            <TextInput
              className="text-slate-800 text-sm font-semibold p-0"
              placeholder={typeConfig.notePlaceholder}
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Tombol Simpan */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!amount || !selectedCategoryId}
            className={`p-4 rounded-2xl items-center shadow-lg ${
              amount && selectedCategoryId
                ? `${typeConfig.btnBg}`
                : 'bg-slate-200'
            }`}
          >
            <Text
              className={`font-black text-base ${
                amount && selectedCategoryId ? 'text-white' : 'text-slate-400'
              }`}
            >
              {typeConfig.btnText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
