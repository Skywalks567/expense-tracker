import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TrendingDown, TrendingUp, PiggyBank } from 'lucide-react-native';
import { TransactionType } from '../../types/expense';

type Props = {
  activeType: TransactionType;
  onChangeType: (type: TransactionType) => void;
};

export default function InputTypeTabs({ activeType, onChangeType }: Props) {
  const isExp = activeType === 'expense';
  const isInc = activeType === 'income';
  const isSav = activeType === 'saving';

  return (
    <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200/80">
      <TouchableOpacity
        onPress={() => onChangeType('expense')}
        activeOpacity={0.8}
        className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
          isExp ? 'bg-white border border-rose-200' : 'bg-transparent border border-transparent'
        }`}
        style={isExp ? { elevation: 2 } : undefined}
      >
        <TrendingDown size={14} color={isExp ? '#E11D48' : '#64748B'} />
        <Text className={`font-extrabold text-xs ${isExp ? 'text-rose-600' : 'text-slate-500'}`}>
          Pengeluaran
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChangeType('income')}
        activeOpacity={0.8}
        className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
          isInc ? 'bg-white border border-emerald-200' : 'bg-transparent border border-transparent'
        }`}
        style={isInc ? { elevation: 2 } : undefined}
      >
        <TrendingUp size={14} color={isInc ? '#059669' : '#64748B'} />
        <Text className={`font-extrabold text-xs ${isInc ? 'text-emerald-600' : 'text-slate-500'}`}>
          Pemasukan
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChangeType('saving')}
        activeOpacity={0.8}
        className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 ${
          isSav ? 'bg-white border border-sky-200' : 'bg-transparent border border-transparent'
        }`}
        style={isSav ? { elevation: 2 } : undefined}
      >
        <PiggyBank size={14} color={isSav ? '#0284C7' : '#64748B'} />
        <Text className={`font-extrabold text-xs ${isSav ? 'text-sky-600' : 'text-slate-500'}`}>
          Tabungan
        </Text>
      </TouchableOpacity>
    </View>
  );
}
