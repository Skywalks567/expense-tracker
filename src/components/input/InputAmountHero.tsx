import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { TransactionType } from '../../types/expense';

type Props = {
  amount: string;
  onChangeAmount: (text: string) => void;
  activeType: TransactionType;
};

export default function InputAmountHero({ amount, onChangeAmount, activeType }: Props) {
  const currentNum = parseInt(amount || '0', 10) || 0;

  const handleAdd = (val: number) => {
    const next = currentNum + val;
    onChangeAmount(next.toString());
  };

  const handleReset = () => {
    onChangeAmount('');
  };

  const formattedAmount = currentNum > 0 ? currentNum.toLocaleString('id-ID') : '';

  const isExp = activeType === 'expense';
  const isInc = activeType === 'income';
  const cardBg = isExp
    ? 'bg-rose-50/60 border-rose-200'
    : isInc
    ? 'bg-emerald-50/60 border-emerald-200'
    : 'bg-sky-50/60 border-sky-200';

  return (
    <View className={`border rounded-3xl p-4 mb-3 items-center ${cardBg}`}>
      <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
        Nominal Transaksi
      </Text>

      <View className="flex-row items-baseline justify-center">
        <Text className="text-xl font-black text-slate-400 mr-1.5">Rp</Text>
        <TextInput
          className="text-3xl font-black text-slate-900 text-center tracking-tight min-w-[120px] p-0"
          placeholder="0"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={formattedAmount}
          onChangeText={(t) => onChangeAmount(t.replace(/[^0-9]/g, ''))}
        />
      </View>

      <View className="flex-row items-center gap-1.5 mt-2.5">
        <TouchableOpacity
          onPress={() => handleAdd(10000)}
          className="bg-white border border-slate-200 px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-[10px] font-bold text-slate-700">+10rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleAdd(20000)}
          className="bg-white border border-slate-200 px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-[10px] font-bold text-slate-700">+20rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleAdd(50000)}
          className="bg-white border border-slate-200 px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-[10px] font-bold text-slate-700">+50rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleAdd(100000)}
          className="bg-white border border-slate-200 px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-[10px] font-bold text-slate-700">+100rb</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          className="bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Text className="text-[10px] font-black text-rose-600">C</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

