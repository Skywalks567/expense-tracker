import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Target, Zap, SlidersHorizontal, Pencil, Check } from 'lucide-react-native';

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
  const [isEditing, setIsEditing] = useState(false);

  const handleModeChange = (mode: 'auto' | 'manual') => {
    setIsEditing(false);
    onChangeMode(mode);
  };
  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  return (
    <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
      <View className="flex-row items-center gap-2 mb-1.5">
        <Target size={16} color="#4F46E5" />
        <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">Mode Anggaran Bulanan</Text>
      </View>
      <Text className="text-slate-400 text-xs mb-3.5">Pilih bagaimana jatah pengeluaran harianmu dihitung.</Text>

      {/* Segmented Switch Auto / Manual */}
      <View className="flex-row bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200/80">
        <TouchableOpacity
          onPress={() => handleModeChange('auto')}
          className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 border ${
            isAuto ? 'bg-white border-indigo-300' : 'border-transparent'
          }`}
        >
          <Zap size={14} color={isAuto ? '#4F46E5' : '#94A3B8'} />
          <Text className={`font-extrabold text-xs ${isAuto ? 'text-indigo-600' : 'text-slate-500'}`}>Otomatis (Saldo)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleModeChange('manual')}
          className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-1.5 border ${
            !isAuto ? 'bg-white border-indigo-300' : 'border-transparent'
          }`}
        >
          <SlidersHorizontal size={14} color={!isAuto ? '#4F46E5' : '#94A3B8'} />
          <Text className={`font-extrabold text-xs ${!isAuto ? 'text-indigo-600' : 'text-slate-500'}`}>Manual (Plafon)</Text>
        </TouchableOpacity>
      </View>

      {/* Field Input */}
      <View className="flex-row items-center gap-2.5">
        <View
          className={`flex-1 rounded-2xl px-3.5 py-2.5 flex-row items-center border ${
            isAuto || !isEditing ? 'bg-slate-100/80 border-slate-200 opacity-70' : 'bg-slate-50 border-indigo-300'
          }`}
        >
          <Text className="text-slate-400 text-xs font-bold mr-1">Rp</Text>
          <TextInput
            value={budgetInput}
            onChangeText={onChangeBudget}
            keyboardType="numeric"
            editable={!isAuto && isEditing}
            placeholder={isAuto ? 'Sesuai Sisa Saldo Kas' : 'Contoh: 3000000'}
            placeholderTextColor="#94A3B8"
            className="flex-1 text-slate-800 font-black text-sm p-0"
          />
        </View>

        {!isAuto && (
          isEditing ? (
            <TouchableOpacity onPress={handleSave} className="bg-indigo-600 px-4 py-2.5 rounded-2xl flex-row items-center gap-1.5" style={{ elevation: 2 }}>
              <Check size={14} color="#FFFFFF" />
              <Text className="text-white text-xs font-bold">Simpan</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)} className="bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl flex-row items-center gap-1.5">
              <Pencil size={13} color="#475569" />
              <Text className="text-slate-700 text-xs font-bold">Ubah</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <Text className="text-[10px] text-slate-400 font-medium mt-2">
        {isAuto
          ? '⚡ Jatah harian otomatis mengikuti sisa uang kas riil (pemasukan - pengeluaran - tabungan).'
          : '✏️ Jatah harian dibagi dari batas plafon tetap yang kamu tentukan sendiri.'}
      </Text>
    </View>
  );
}

