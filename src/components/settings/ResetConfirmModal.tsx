import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ResetConfirmModal({
  visible,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
          <View className="flex-row items-center gap-2.5 mb-2">
            <View className="w-10 h-10 rounded-2xl bg-rose-50 items-center justify-center">
              <AlertTriangle size={20} color="#E11D48" />
            </View>
            <Text className="text-slate-900 text-base font-extrabold">
              Reset Semua Data?
            </Text>
          </View>
          <Text className="text-slate-500 text-xs mb-5 leading-relaxed">
            Seluruh catatan transaksi akan dihapus dan saldo akan diatur ulang ke nol. Tindakan ini tidak dapat dibatalkan.
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
              className="bg-rose-600 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Text className="text-white text-xs font-bold">Ya, Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

