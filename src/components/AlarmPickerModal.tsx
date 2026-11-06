import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { AlarmClock, BellRing } from 'lucide-react-native';

type Props = {
  visible: boolean;
  currentAlarmTime: string;
  onClose: () => void;
  onSave: (newTime: string) => void;
};

export default function AlarmPickerModal({
  visible,
  currentAlarmTime,
  onClose,
  onSave,
}: Props) {
  const [timeInput, setTimeInput] = useState(currentAlarmTime || '20:00');

  const presetTimes = ['19:00', '20:00', '21:00', '22:00'];

  const handleSave = () => {
    // Validasi sederhana format HH:mm
    let formatted = timeInput.trim();
    if (!formatted.includes(':') && formatted.length === 4) {
      formatted = `${formatted.slice(0, 2)}:${formatted.slice(2)}`;
    }
    onSave(formatted || '20:00');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
          <View className="flex-row items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center">
              <AlarmClock size={20} color="#D97706" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 text-base font-extrabold">
                Jam Alarm Pengingat
              </Text>
            </View>
          </View>

          <Text className="text-slate-500 text-xs mb-5">
            Aplikasi akan memicu notifikasi pengingat jika belum ada transaksi hingga jam ini.
          </Text>

          {/* Input Box Waktu */}
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-1">
                Jam Pengingat Harian (WIB)
              </Text>
              <TextInput
                value={timeInput}
                onChangeText={setTimeInput}
                placeholder="20:00"
                placeholderTextColor="#A8A29E"
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                className="text-slate-900 text-3xl font-black p-0"
              />
            </View>
            <BellRing size={28} color="#F59E0B" />
          </View>

          {/* Preset Waktu Cepat */}
          <View className="flex-row gap-2 mb-6">
            {presetTimes.map((preset) => (
              <TouchableOpacity
                key={preset}
                onPress={() => setTimeInput(preset)}
                className={`flex-1 py-2 rounded-xl items-center border ${
                  timeInput === preset
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    timeInput === preset ? 'text-white' : 'text-slate-600'
                  }`}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tombol Aksi */}
          <View className="flex-row justify-end gap-2.5">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <Text className="text-xs text-slate-500 font-bold">Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Text className="text-white text-xs font-bold">Simpan Alarm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

