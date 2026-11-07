import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
} from 'lucide-react-native';
import { useExpenseStore } from '../store/useExpenseStore';

type Props = {
  totalExpenseThisMonth: number;
  totalIncomeThisMonth: number;
  totalSavingThisMonth: number;
};

export default function HeroBalanceCard({
  totalExpenseThisMonth,
  totalIncomeThisMonth,
  totalSavingThisMonth,
}: Props) {
  const { isBalanceHidden, toggleBalanceHidden } = useExpenseStore();

  const netBalance = totalIncomeThisMonth - totalExpenseThisMonth;

  // Nama bulan & tahun saat ini dalam Bahasa Indonesia
  const currentMonthYear = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <View
      className="rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden border border-indigo-500/20"
      style={{
        backgroundColor: '#0f172a',
      }}
    >
      {/* Decorative Glow Elements */}
      <View
        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-30"
        style={{ backgroundColor: '#6366f1' }}
      />
      <View
        className="absolute -left-8 -top-8 w-28 h-28 rounded-full opacity-20"
        style={{ backgroundColor: '#8b5cf6' }}
      />

      {/* Baris Atas: Label Saldo & Badge Bulan */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">
            Sisa Saldo Bulan Ini
          </Text>
          <View className="flex-row items-center gap-2.5 mt-1">
            <Text className="text-2xl font-black tracking-tight text-white">
              {isBalanceHidden
                ? '••••••••'
                : `Rp ${netBalance.toLocaleString('id-ID')}`}
            </Text>
            <TouchableOpacity
              onPress={toggleBalanceHidden}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-1"
            >
              {isBalanceHidden ? (
                <EyeOff size={18} color="#A5B4FC" />
              ) : (
                <Eye size={18} color="#A5B4FC" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Text className="text-[10px] font-extrabold text-indigo-100">
            ● {currentMonthYear}
          </Text>
        </View>
      </View>

      {/* Metric Summary Chips (Masuk, Keluar, Ditabung) */}
      <View className="flex-row gap-2 mt-3 p-2.5 bg-white/5 rounded-2xl border border-white/10">
        {/* Masuk */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-emerald-500/20 items-center justify-center">
            <ArrowDownLeft size={13} color="#34D399" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Masuk</Text>
            <Text
              className="text-[11px] font-bold text-emerald-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `+${totalIncomeThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>

        {/* Keluar */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-rose-500/20 items-center justify-center">
            <ArrowUpRight size={13} color="#FB7185" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Keluar</Text>
            <Text
              className="text-[11px] font-bold text-rose-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `-${totalExpenseThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>

        {/* Tabungan */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-sky-500/20 items-center justify-center">
            <PiggyBank size={13} color="#38BDF8" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Nabung</Text>
            <Text
              className="text-[11px] font-bold text-sky-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `${totalSavingThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
