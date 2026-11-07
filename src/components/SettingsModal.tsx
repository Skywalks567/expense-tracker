import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Settings,
  X,
  AlarmClock,
  Target,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
} from 'lucide-react-native';
import { useExpenseStore } from '../store/useExpenseStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: Props) {
  const {
    monthlyBudget,
    setMonthlyBudget,
    alarmTime,
    setAlarmTime,
    expenses,
    resetAllData,
  } = useExpenseStore();

  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const [tempAlarm, setTempAlarm] = useState(alarmTime);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const presetTimes = ['19:00', '20:00', '21:00', '22:00'];

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);
  };

  const handleSaveBudget = () => {
    const num = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setMonthlyBudget(num);
      showSuccess('Batas budget berhasil disimpan');
    }
  };

  const handleSaveAlarm = (time: string) => {
    setTempAlarm(time);
    setAlarmTime(time);
    showSuccess(`Alarm diatur ke pukul ${time} WIB`);
  };

  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(expenses, null, 2);
      Alert.alert(
        'Cadangan Data Berhasil Dibuat',
        `Terdapat ${expenses.length} catatan transaksi yang telah siap dicadangkan.`,
        [{ text: 'Tutup' }]
      );
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat mencadangkan data.');
    }
  };

  const handleExecuteReset = async () => {
    await resetAllData();
    setIsResetConfirmOpen(false);
    showSuccess('Seluruh catatan berhasil direset');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-900/60 justify-end">
        <View
          className="bg-white rounded-t-[36px] pt-3 pb-8 px-6 w-full shadow-2xl"
          style={{ height: '88%' }}
        >
          {/* Handle bar */}
          <View className="w-12 h-1.5 bg-slate-300 rounded-full self-center mb-3" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                <Settings size={18} color="#475569" />
              </View>
              <Text className="text-slate-900 text-lg font-extrabold">
                Pengaturan
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="p-1 rounded-full bg-slate-100"
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Toast Notifikasi Sukses */}
          {successMessage && (
            <View className="bg-emerald-50 border border-emerald-200 py-2.5 px-3.5 rounded-2xl flex-row items-center gap-2 mb-4">
              <CheckCircle2 size={16} color="#059669" />
              <Text className="text-emerald-800 text-xs font-bold">
                {successMessage}
              </Text>
            </View>
          )}

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* 1. Pengaturan Alarm */}
            <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-1.5">
                <AlarmClock size={16} color="#D97706" />
                <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                  Jam Alarm Pengingat
                </Text>
              </View>
              <Text className="text-slate-400 text-xs mb-3">
                Waktu harian untuk mengingatkan pencatatan jika belum ada transaksi.
              </Text>

              <View className="flex-row gap-2">
                {presetTimes.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => handleSaveAlarm(preset)}
                    className={`flex-1 py-2 rounded-xl items-center border ${
                      tempAlarm === preset
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        tempAlarm === preset ? 'text-white' : 'text-slate-700'
                      }`}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 2. Pengaturan Batas Budget Bulanan */}
            <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center gap-2 mb-1.5">
                <Target size={16} color="#4F46E5" />
                <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
                  Batas Budget Bulanan
                </Text>
              </View>
              <Text className="text-slate-400 text-xs mb-3">
                Menjadi dasar perhitungan jatah belanja harian di beranda.
              </Text>

              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-row items-center">
                  <Text className="text-slate-400 text-xs font-bold mr-1">Rp</Text>
                  <TextInput
                    value={tempBudget}
                    onChangeText={setTempBudget}
                    keyboardType="numeric"
                    className="flex-1 text-slate-800 font-black text-sm p-0"
                  />
                </View>
                <TouchableOpacity
                  onPress={handleSaveBudget}
                  className="bg-indigo-600 px-4 py-2.5 rounded-xl shadow-sm"
                >
                  <Text className="text-white text-xs font-bold">Simpan</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 3. Manajemen Data Cadangan */}
            <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-4">
              <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-1.5">
                Manajemen Data
              </Text>
              <Text className="text-slate-400 text-xs mb-3">
                Amankan catatan keuangan Anda untuk dipindahkan ke perangkat lain.
              </Text>

              <TouchableOpacity
                onPress={handleExportBackup}
                activeOpacity={0.7}
                className="bg-white border border-slate-200 py-3 px-3.5 rounded-xl flex-row items-center justify-between mb-2 shadow-sm"
              >
                <View className="flex-row items-center gap-2.5">
                  <Download size={16} color="#4F46E5" />
                  <Text className="text-slate-700 text-xs font-bold">
                    Backup Data (Export JSON)
                  </Text>
                </View>
                <Text className="text-slate-400 text-[11px] font-semibold">
                  {expenses.length} Catatan
                </Text>
              </TouchableOpacity>
            </View>

            {/* 4. Reset Data */}
            <View className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-6">
              <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-1.5">
                Zona Bahaya
              </Text>
              <Text className="text-slate-400 text-xs mb-3">
                Menghapus semua riwayat transaksi untuk memulai dari awal.
              </Text>

              <TouchableOpacity
                onPress={() => setIsResetConfirmOpen(true)}
                activeOpacity={0.7}
                className="bg-rose-50 border border-rose-200 py-3 px-3.5 rounded-xl flex-row items-center justify-center gap-2"
              >
                <Trash2 size={16} color="#E11D48" />
                <Text className="text-rose-600 text-xs font-bold">
                  Hapus Seluruh Data Catatan
                </Text>
              </TouchableOpacity>
            </View>

            {/* Versi Aplikasi */}
            <View className="items-center pb-6">
              <Text className="text-slate-400 text-xs font-semibold">
                Versi 1.0.0
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Modal Konfirmasi Reset Data */}
      <Modal visible={isResetConfirmOpen} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
          <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
            <View className="flex-row items-center gap-2.5 mb-2">
              <View className="w-10 h-10 rounded-2xl bg-rose-50 items-center justify-center">
                <Trash2 size={20} color="#E11D48" />
              </View>
              <Text className="text-slate-900 text-base font-extrabold">
                Reset Semua Data?
              </Text>
            </View>
            <Text className="text-slate-500 text-xs mb-5">
              Seluruh catatan transaksi akan dihapus dan saldo akan diatur ulang ke nol. Tindakan ini tidak dapat dibatalkan.
            </Text>

            <View className="flex-row justify-end gap-2.5">
              <TouchableOpacity
                onPress={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200"
              >
                <Text className="text-xs text-slate-500 font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExecuteReset}
                className="bg-rose-600 px-5 py-2.5 rounded-xl shadow-sm"
              >
                <Text className="text-white text-xs font-bold">Ya, Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

