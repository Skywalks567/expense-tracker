import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Target } from 'lucide-react-native';

type Props = {
  budgetInput: string;
  onChangeBudget: (val: string) => void;
  onSave: () => void;
};

export default function BudgetSection({
  budgetInput,
  onChangeBudget,
  onSave,
}: Props) {
  return (
    <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
      <View className="flex-row items-center gap-2 mb-1.5">
        <Target size={16} color="#4F46E5" />
        <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
          Batas Budget Bulanan
        </Text>
      </View>
      <Text className="text-slate-400 text-xs mb-4">
        Plafon pengeluaran bulanan yang membagi jatah belanja harian di beranda.
      </Text>
      <View className="flex-row items-center gap-2.5">
        <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
          <Text className="text-slate-400 text-xs font-bold mr-1">Rp</Text>
          <TextInput
            value={budgetInput}
            onChangeText={onChangeBudget}
            keyboardType="numeric"
            className="flex-1 text-slate-800 font-black text-sm p-0"
          />
        </View>
        <TouchableOpacity
          onPress={onSave}
          className="bg-indigo-600 px-5 py-3 rounded-2xl shadow-sm"
        >
          <Text className="text-white text-xs font-bold">Simpan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

