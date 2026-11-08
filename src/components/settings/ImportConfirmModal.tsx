import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Upload } from 'lucide-react-native';

type Props = {
  visible: boolean;
  itemCount: number;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ImportConfirmModal({
  visible,
  itemCount,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
          <View className="flex-row items-center gap-2.5 mb-2">
            <View className="w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center">
              <Upload size={20} color="#059669" />
            </View>
            <Text className="text-slate-900 text-base font-extrabold">
              Pulihkan Data Cadangan?
            </Text>
          </View>

          <Text className="text-slate-500 text-xs mb-5 leading-relaxed">
            Ditemukan <Text className="font-bold text-slate-800">{itemCount} catatan transaksi</Text> di dalam file cadangan. Catatan ini akan ditambahkan ke database lokal Anda.
          </Text>

          <View className="flex-row justify-end gap-2.5">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <Text className="text-xs text-slate-500 font-bold">Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="bg-emerald-600 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Text className="text-white text-xs font-bold">Terapkan Pemulihan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

