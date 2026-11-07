import React from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { Upload } from 'lucide-react-native';

type Props = {
  visible: boolean;
  importJsonInput: string;
  importError: string | null;
  onChangeInput: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ImportRestoreModal({
  visible,
  importJsonInput,
  importError,
  onChangeInput,
  onClose,
  onSubmit,
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
              Restore Data Catatan
            </Text>
          </View>

          <Text className="text-slate-500 text-xs mb-3">
            Tempel (*paste*) teks cadangan JSON yang Anda miliki ke kolom di bawah ini.
          </Text>

          {importError && (
            <View className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl mb-3">
              <Text className="text-rose-600 text-[11px] font-bold">
                {importError}
              </Text>
            </View>
          )}

          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-4 h-32">
            <TextInput
              value={importJsonInput}
              onChangeText={onChangeInput}
              placeholder="[ { amount: 50000, categoryId: 'makan_minum', ... } ]"
              placeholderTextColor="#94A3B8"
              multiline
              className="flex-1 text-slate-800 text-xs font-mono p-0"
            />
          </View>

          <View className="flex-row justify-end gap-2.5">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <Text className="text-xs text-slate-500 font-bold">Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
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

