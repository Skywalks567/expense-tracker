import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { FileText } from 'lucide-react-native';

type Props = {
  visible: boolean;
  exportJsonString: string;
  onClose: () => void;
};

export default function ExportBackupModal({
  visible,
  exportJsonString,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl max-h-[80%]">
          <View className="flex-row items-center gap-2.5 mb-2">
            <View className="w-10 h-10 rounded-2xl bg-indigo-50 items-center justify-center">
              <FileText size={20} color="#4F46E5" />
            </View>
            <Text className="text-slate-900 text-base font-extrabold">
              Data Cadangan JSON
            </Text>
          </View>

          <Text className="text-slate-500 text-xs mb-4">
            Salin teks JSON di bawah ini dan simpan di catatan aman atau kirim ke perangkat lain.
          </Text>

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 max-h-48 overflow-hidden">
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              <Text className="text-slate-700 text-[11px] font-mono leading-relaxed select-all">
                {exportJsonString}
              </Text>
            </ScrollView>
          </View>

          <View className="flex-row justify-end gap-2.5">
            <TouchableOpacity
              onPress={onClose}
              className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Text className="text-white text-xs font-bold">Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

