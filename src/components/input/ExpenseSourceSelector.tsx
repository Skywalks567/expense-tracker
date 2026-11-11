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
    <View className="mb-4">
      <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
        Sumber Dana
      </Text>

      <View className="flex-row bg-slate-100 p-1 rounded-2xl gap-1">
        <TouchableOpacity
          onPress={() => onSourceChange('cash')}
          activeOpacity={0.7}
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-2 ${
            isCash ? 'bg-white border border-slate-200/80' : 'bg-transparent'
          }`}
          style={isCash ? { elevation: 1 } : undefined}
        >
          <Wallet size={15} color={isCash ? '#4F46E5' : '#64748B'} />
          <Text className={`text-xs font-bold ${isCash ? 'text-indigo-600' : 'text-slate-600'}`}>
            Kas Harian
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSourceChange('saving')}
          activeOpacity={0.7}
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl gap-2 ${
            !isCash ? 'bg-sky-500 border border-sky-600' : 'bg-transparent'
          }`}
          style={!isCash ? { elevation: 1 } : undefined}
        >
          <PiggyBank size={15} color={!isCash ? '#FFFFFF' : '#64748B'} />
          <Text className={`text-xs font-bold ${!isCash ? 'text-white' : 'text-slate-600'}`}>
            Tabungan
          </Text>
        </TouchableOpacity>
      </View>

      {!isCash && (
        <View className="mt-2.5 p-3 rounded-2xl bg-sky-50/80 border border-sky-100">
          <TouchableOpacity
            onPress={onToggleSavingLoan}
            activeOpacity={0.7}
            className="flex-row items-center gap-2.5"
          >
            {isSavingLoan ? (
              <CheckSquare size={18} color="#0284C7" />
            ) : (
              <Square size={18} color="#64748B" />
            )}
            <View className="flex-1">
              <Text className="text-xs font-bold text-sky-950">
                Pinjam dari Tabungan (Perlu Diganti)
              </Text>
              <Text className="text-[10px] text-sky-700/80 mt-0.5">
                Bisa dicatat sebagai hutang ke tabungan pribadi
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

