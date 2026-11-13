import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, PiggyBank, CheckSquare, Square } from 'lucide-react-native';
import { ExpenseSource } from '../../types/expense';

type Props = {
  source: ExpenseSource;
  onSourceChange: (source: ExpenseSource) => void;
  isSavingLoan: boolean;
  onToggleSavingLoan: () => void;
};

export default function ExpenseSourceSelector({
  source,
  onSourceChange,
  isSavingLoan,
  onToggleSavingLoan,
}: Props) {
  const isCash = source === 'cash';

  return (
    <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
          Sumber Dana
        </Text>
        <Text className="text-[10px] text-slate-400 font-semibold">
          {isCash ? 'Potong batas harian' : 'Tidak potong kuota'}
        </Text>
      </View>

      <View className="flex-row bg-slate-200/60 p-1 rounded-xl gap-1">
        <TouchableOpacity
          onPress={() => onSourceChange('cash')}
          activeOpacity={0.8}
          className={`flex-1 flex-row items-center justify-center py-2 rounded-lg gap-1.5 ${
            isCash ? 'bg-white border border-indigo-200' : 'bg-transparent border border-transparent'
          }`}
          style={isCash ? { elevation: 1 } : undefined}
        >
          <Wallet size={14} color={isCash ? '#4F46E5' : '#64748B'} />
          <Text className={`text-xs font-bold ${isCash ? 'text-indigo-600' : 'text-slate-600'}`}>
            Kas Harian
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSourceChange('saving')}
          activeOpacity={0.8}
          className={`flex-1 flex-row items-center justify-center py-2 rounded-lg gap-1.5 ${
            !isCash ? 'bg-sky-500 border border-sky-600' : 'bg-transparent border border-transparent'
          }`}
          style={!isCash ? { elevation: 1 } : undefined}
        >
          <PiggyBank size={14} color={!isCash ? '#FFFFFF' : '#64748B'} />
          <Text className={`text-xs font-bold ${!isCash ? 'text-white' : 'text-slate-600'}`}>
            Tabungan
          </Text>
        </TouchableOpacity>
      </View>

      {!isCash && (
        <View className="mt-2.5 pt-2.5 border-t border-sky-100">
          <TouchableOpacity
            onPress={onToggleSavingLoan}
            activeOpacity={0.7}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              {isSavingLoan ? (
                <CheckSquare size={16} color="#0284C7" />
              ) : (
                <Square size={16} color="#94A3B8" />
              )}
              <Text className="text-xs font-bold text-sky-950">
                Pinjam dari Tabungan (Perlu Diganti)
              </Text>
            </View>
            <View className="bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
              <Text className="text-[9px] font-black text-amber-800">Hutang</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
