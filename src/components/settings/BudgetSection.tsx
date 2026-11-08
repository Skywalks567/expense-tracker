import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Target, Zap, SlidersHorizontal } from 'lucide-react-native';

type Props = {
  budgetMode: 'auto' | 'manual';
  onChangeMode: (mode: 'auto' | 'manual') => void;
  budgetInput: string;
  onChangeBudget: (val: string) => void;
  onSave: () => void;
};

export default function BudgetSection({
  budgetMode,
  onChangeMode,
  budgetInput,
  onChangeBudget,
  onSave,
}: Props) {
  const isAuto = budgetMode === 'auto';

  return (
    <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
      <View className="flex-row items-center gap-2 mb-1.5">
        <Target size={16} color="#4F46E5" />
        <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
          Mode Anggaran Bulanan
        </Text>
      </View>

      <Text className="text-slate-400 text-xs mb-3.5">
        Pilih bagaimana jatah pengeluaran harianmu dihitung.
      </Text>

      {/* Segmented Switch Auto / Manual */}
      <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200/80">
        <TouchableOpacity
          onPress={() => onChangeMode('auto')}
          className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 border ${
            isAuto ? 'bg-white border-indigo-300' : 'border-transparent'
          }`}
        >
          <Zap size={14} color={isAuto ? '#4F46E5' : '#94A3B8'} />
          <Text className={`font-extrabold text-xs ${isAuto ? 'text-indigo-600' : 'text-slate-500'}`}>
            Otomatis (Saldo)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onChangeMode('manual')}
          className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 border ${
            !isAuto ? 'bg-white border-indigo-300' : 'border-transparent'
          }`}
        >
          <SlidersHorizontal size={14} color={!isAuto ? '#4F46E5' : '#94A3B8'} />
          <Text className={`font-extrabold text-xs ${!isAuto ? 'text-indigo-600' : 'text-slate-500'}`}>
            Manual (Plafon)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Field Input (Disabled jika Auto, Aktif jika Manual) */}
      <View className="flex-row items-center gap-2.5">
        <View
          className={`flex-1 rounded-2xl px-3.5 py-2.5 flex-row items-center border ${
            isAuto ? 'bg-slate-100/80 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <Text className="text-slate-400 text-xs font-bold mr-1">Rp</Text>
          <TextInput
            value={budgetInput}
            onChangeText={onChangeBudget}
            keyboardType="numeric"
            editable={!isAuto}
            placeholder={isAuto ? 'Sesuai Sisa Saldo Kas' : 'Contoh: 3000000'}
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 font-black text-sm p-0"
          />
        </View>
        {!isAuto && (
          <TouchableOpacity
            onPress={onSave}
            className="bg-indigo-600 px-5 py-3 rounded-2xl"
            style={{ elevation: 2 }}
          >
            <Text className="text-white text-xs font-bold">Simpan</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Catatan Keterangan Mode */}
      <Text className="text-[10px] text-slate-400 font-medium mt-2">
        {isAuto
          ? '⚡ Jatah harian otomatis mengikuti sisa uang kas riil (pemasukan - pengeluaran - tabungan).'
          : '✏️ Jatah harian dibagi dari batas plafon tetap yang kamu tentukan sendiri.'}
      </Text>
    </View>
  );
}

