import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle2 } from 'lucide-react-native';

type Props = {
  alarmTime: string;
  hasTransactionsToday: boolean;
  onOpenSettings: () => void;
};

export default function SmartAlarmCard({
  alarmTime,
  hasTransactionsToday,
  onOpenSettings,
}: Props) {
  const isDone = hasTransactionsToday;

  return (
    <View
      className={`rounded-2xl p-3.5 mb-5 border flex-row items-center justify-between shadow-sm ${
        isDone
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}
    >
      <View className="flex-row items-center gap-3 flex-1 pr-2">
        <View
          className={`w-11 h-11 rounded-2xl items-center justify-center shadow-sm relative ${
            isDone ? 'bg-emerald-600' : 'bg-amber-500'
          }`}
        >
          {isDone ? (
            <CheckCircle2 size={22} color="#FFFFFF" />
          ) : (
            <Clock size={22} color="#FFFFFF" />
          )}
          {!isDone && (
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className={`text-xs font-extrabold ${
                isDone ? 'text-emerald-950' : 'text-amber-950'
              }`}
            >
              Alarm Pengingat
            </Text>
            <View
              className={`px-2 py-0.5 rounded-full ${
                isDone ? 'bg-emerald-950' : 'bg-amber-950'
              }`}
            >
              <Text
                className={`text-[9px] font-black ${
                  isDone ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {alarmTime} WIB
              </Text>
            </View>
          </View>
          <Text
            className={`text-[11px] font-semibold mt-0.5 ${
              isDone ? 'text-emerald-700' : 'text-amber-800'
            }`}
          >
            {isDone
              ? 'Transaksi hari ini tercatat • Alarm selesai'
              : 'Belum ada transaksi • Alarm aktif'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onOpenSettings}
        activeOpacity={0.7}
        className={`px-3.5 py-2 rounded-xl shadow-sm ${
          isDone ? 'bg-emerald-600' : 'bg-amber-500'
        }`}
      >
        <Text className="text-white text-[11px] font-extrabold">Atur</Text>
      </TouchableOpacity>
    </View>
  );
}

