import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native';

type Props = {
  onPressReset: () => void;
};

export default function DangerZoneSection({ onPressReset }: Props) {
  return (
    <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-6 shadow-sm">
      <Text className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-1.5">
        Zona Bahaya
      </Text>
      <Text className="text-slate-400 text-xs mb-4">
        Menghapus permanen seluruh riwayat transaksi.
      </Text>
      <TouchableOpacity
        onPress={onPressReset}
        className="bg-rose-50 border border-rose-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-center gap-2"
      >
        <Trash2 size={16} color="#E11D48" />
        <Text className="text-rose-600 text-xs font-bold">Hapus Seluruh Data Catatan</Text>
      </TouchableOpacity>
    </View>
  );
}

