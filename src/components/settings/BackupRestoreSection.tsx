import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Download, Upload } from 'lucide-react-native';

type Props = {
  totalRecords: number;
  onExport: () => void;
  onImport: () => void;
};

export default function BackupRestoreSection({
  totalRecords,
  onExport,
  onImport,
}: Props) {
  return (
    <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
      <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-1.5">
        Manajemen Data Cadangan
      </Text>
      <Text className="text-slate-400 text-xs mb-4">
        Ekspor seluruh catatan ke format JSON atau pulihkan data saat ganti perangkat.
      </Text>
      <TouchableOpacity
        onPress={onExport}
        className="bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-sm"
      >
        <View className="flex-row items-center gap-2.5">
          <Download size={16} color="#4F46E5" />
          <Text className="text-slate-700 text-xs font-bold">Backup Data (Export JSON)</Text>
        </View>
        <Text className="text-slate-400 text-[11px] font-semibold">{totalRecords} Catatan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onImport}
        className="bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center gap-2.5">
          <Upload size={16} color="#059669" />
          <Text className="text-slate-700 text-xs font-bold">Restore Data (Import JSON)</Text>
        </View>
        <Text className="text-emerald-600 text-[11px] font-bold">Pulihkan</Text>
      </TouchableOpacity>
    </View>
  );
}

