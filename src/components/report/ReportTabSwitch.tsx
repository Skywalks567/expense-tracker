import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PieChart, ListFilter } from 'lucide-react-native';

type Props = {
  activeTab: 'summary' | 'transactions';
  onTabChange: (tab: 'summary' | 'transactions') => void;
  txCount: number;
};

export default function ReportTabSwitch({ activeTab, onTabChange, txCount }: Props) {
  const isSummary = activeTab === 'summary';

  return (
    <View className="bg-slate-200/80 p-1 rounded-2xl flex-row items-center mb-4">
      <TouchableOpacity
        key="btn-summary"
        onPress={() => onTabChange('summary')}
        activeOpacity={0.8}
        className={`flex-1 py-2 rounded-xl flex-row items-center justify-center gap-1.5 ${
          isSummary ? 'bg-indigo-600' : 'bg-transparent'
        }`}
        style={isSummary ? { elevation: 2 } : undefined}
      >
        <PieChart size={13} color={isSummary ? '#FFFFFF' : '#64748B'} />
        <Text className={`text-xs font-bold ${isSummary ? 'text-white' : 'text-slate-600'}`}>
          Ringkasan & Grafik
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="btn-tx"
        onPress={() => onTabChange('transactions')}
        activeOpacity={0.8}
        className={`flex-1 py-2 rounded-xl flex-row items-center justify-center gap-1.5 ${
          !isSummary ? 'bg-indigo-600' : 'bg-transparent'
        }`}
        style={!isSummary ? { elevation: 2 } : undefined}
      >
        <ListFilter size={13} color={!isSummary ? '#FFFFFF' : '#64748B'} />
        <Text className={`text-xs font-bold ${!isSummary ? 'text-white' : 'text-slate-600'}`}>
          Daftar Transaksi ({txCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
