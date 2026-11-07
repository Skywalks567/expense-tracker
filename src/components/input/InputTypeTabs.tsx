import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TransactionType } from '../../types/expense';
import { inputTypeConfigs } from '../../constants/inputConfig';

type Props = {
  activeType: TransactionType;
  onChangeType: (type: TransactionType) => void;
};

export default function InputTypeTabs({ activeType, onChangeType }: Props) {
  const currentConfig = inputTypeConfigs[activeType];

  return (
    <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200/80">
      <TouchableOpacity
        onPress={() => onChangeType('expense')}
        className={`flex-1 py-2.5 rounded-xl items-center border ${
          activeType === 'expense' ? currentConfig.activeTabBg : 'border-transparent'
        }`}
      >
        <Text className={`font-extrabold text-xs ${activeType === 'expense' ? 'text-rose-600' : 'text-slate-500'}`}>
          Pengeluaran
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChangeType('income')}
        className={`flex-1 py-2.5 rounded-xl items-center border ${
          activeType === 'income' ? currentConfig.activeTabBg : 'border-transparent'
        }`}
      >
        <Text className={`font-extrabold text-xs ${activeType === 'income' ? 'text-emerald-600' : 'text-slate-500'}`}>
          Pemasukan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChangeType('saving')}
        className={`flex-1 py-2.5 rounded-xl items-center border ${
          activeType === 'saving' ? currentConfig.activeTabBg : 'border-transparent'
        }`}
      >
        <Text className={`font-extrabold text-xs ${activeType === 'saving' ? 'text-sky-600' : 'text-slate-500'}`}>
          Tabungan
        </Text>
      </TouchableOpacity>
    </View>
  );
}

