import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { FileText } from 'lucide-react-native';

type Props = {
  note: string;
  onChangeNote: (text: string) => void;
};

export default function InputNoteField({ note, onChangeNote }: Props) {
  return (
    <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-4">
      <View className="flex-row items-center gap-1.5 mb-1.5">
        <FileText size={12} color="#94A3B8" />
        <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          Catatan Detail (Opsional)
        </Text>
      </View>
      <TextInput
        className="text-xs font-semibold text-slate-800 p-0"
        placeholder="Tuliskan keterangan detail transaksi..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        style={{ minHeight: 54, textAlignVertical: 'top' }}
        value={note}
        onChangeText={onChangeNote}
      />
    </View>
  );
}

