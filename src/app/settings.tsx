import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Target,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react-native';
import { useExpenseStore, Expense } from '../store/useExpenseStore';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    monthlyBudget,
    setMonthlyBudget,
    expenses,
    resetAllData,
    importExpenses,
  } = useExpenseStore();

  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State untuk modal Export, Import, dan Reset
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportJsonString, setExportJsonString] = useState('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonInput, setImportJsonInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

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

  // 1. Ekspor Data ke JSON
  const handleOpenExport = () => {
    try {
      const jsonStr = JSON.stringify(expenses, null, 2);
      setExportJsonString(jsonStr);
      setIsExportModalOpen(true);
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat memproses data cadangan.');
    }
  };

  // 2. Impor Data dari JSON
  const handleExecuteImport = async () => {
    setImportError(null);
    if (!importJsonInput.trim()) {
      setImportError('Silakan tempel teks data JSON terlebih dahulu.');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonInput);
      if (!Array.isArray(parsed)) {
        setImportError('Format tidak valid. Data harus berupa array JSON catatan transaksi.');
        return;
      }

      const validItems: Expense[] = parsed.filter(
        (item: any) => item && typeof item.amount === 'number' && item.categoryId
      );

      if (validItems.length === 0) {
        setImportError('Tidak ditemukan transaksi valid di dalam data yang ditempel.');
        return;
      }

      await importExpenses(validItems);
      setIsImportModalOpen(false);
      setImportJsonInput('');
      showSuccess(`Berhasil memulihkan ${validItems.length} transaksi`);
    } catch (err: any) {
      setImportError('Format JSON salah atau rusak. Periksa kembali teks cadangan Anda.');
    }
  };

  // 3. Reset Semua Data
  const handleExecuteReset = async () => {
    await resetAllData();
    setIsResetConfirmOpen(false);
    showSuccess('Seluruh catatan berhasil direset');
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Halaman Penuh */}
      <View className="px-5 pt-12 pb-4 bg-white border-b border-slate-200/80 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60"
        >
          <ArrowLeft size={18} color="#334155" />
        </TouchableOpacity>

        <Text className="text-slate-900 font-extrabold text-base">
          Pengaturan
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Toast Notifikasi Sukses */}
        {successMessage && (
          <View className="bg-emerald-50 border border-emerald-200 py-3 px-4 rounded-2xl flex-row items-center gap-2.5 mb-5 shadow-sm">
            <CheckCircle2 size={18} color="#059669" />
            <Text className="text-emerald-800 text-xs font-bold">
              {successMessage}
            </Text>
          </View>
        )}

        {/* 1. Pengaturan Batas Budget Bulanan */}
        <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center gap-2 mb-1.5">
            <Target size={16} color="#4F46E5" />
            <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider">
              Batas Budget Bulanan
            </Text>
          </View>
          <Text className="text-slate-400 text-xs mb-4 leading-relaxed">
            Plafon pengeluaran maksimal per bulan yang membagi jatah belanja harian di beranda.
          </Text>

          <View className="flex-row items-center gap-2.5">
            <View className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 flex-row items-center">
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
              className="bg-indigo-600 px-5 py-3 rounded-2xl shadow-sm shadow-indigo-200"
            >
              <Text className="text-white text-xs font-bold">Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Manajemen Data Cadangan (Backup & Restore) */}
        <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-5 shadow-sm">
          <Text className="text-slate-800 font-extrabold text-xs uppercase tracking-wider mb-1.5">
            Manajemen Data Cadangan
          </Text>
          <Text className="text-slate-400 text-xs mb-4 leading-relaxed">
            Ekspor seluruh catatan keuangan Anda ke format JSON atau pulihkan data saat berganti perangkat.
          </Text>

          {/* Tombol Export */}
          <TouchableOpacity
            onPress={handleOpenExport}
            activeOpacity={0.7}
            className="bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-between mb-3 shadow-sm"
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

          {/* Tombol Import / Restore */}
          <TouchableOpacity
            onPress={() => {
              setImportError(null);
              setImportJsonInput('');
              setIsImportModalOpen(true);
            }}
            activeOpacity={0.7}
            className="bg-slate-50 border border-slate-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center gap-2.5">
              <Upload size={16} color="#059669" />
              <Text className="text-slate-700 text-xs font-bold">
                Restore Data (Import JSON)
              </Text>
            </View>
            <Text className="text-emerald-600 text-[11px] font-bold">
              Pulihkan
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Zona Bahaya (Reset Data) */}
        <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-6 shadow-sm">
          <Text className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-1.5">
            Zona Bahaya
          </Text>
          <Text className="text-slate-400 text-xs mb-4 leading-relaxed">
            Menghapus permanen semua riwayat catatan transaksi dan mengatur ulang saldo ke nol.
          </Text>

          <TouchableOpacity
            onPress={() => setIsResetConfirmOpen(true)}
            activeOpacity={0.7}
            className="bg-rose-50 border border-rose-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-center gap-2"
          >
            <Trash2 size={16} color="#E11D48" />
            <Text className="text-rose-600 text-xs font-bold">
              Hapus Seluruh Data Catatan
            </Text>
          </TouchableOpacity>
        </View>

        {/* Versi Aplikasi */}
        <View className="items-center pb-4">
          <Text className="text-slate-400 text-xs font-semibold">
            Versi 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* MODAL 1: Tampilkan & Salin Data Cadangan (Export JSON) */}
      <Modal visible={isExportModalOpen} transparent animationType="fade">
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
                onPress={() => setIsExportModalOpen(false)}
                className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm"
              >
                <Text className="text-white text-xs font-bold">Selesai</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Tempel & Pulihkan Data (Import JSON) */}
      <Modal visible={isImportModalOpen} transparent animationType="fade">
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
                onChangeText={setImportJsonInput}
                placeholder="[ { amount: 50000, categoryId: 'makan_minum', ... } ]"
                placeholderTextColor="#94A3B8"
                multiline
                className="flex-1 text-slate-800 text-xs font-mono p-0"
              />
            </View>

            <View className="flex-row justify-end gap-2.5">
              <TouchableOpacity
                onPress={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200"
              >
                <Text className="text-xs text-slate-500 font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExecuteImport}
                className="bg-emerald-600 px-5 py-2.5 rounded-xl shadow-sm"
              >
                <Text className="text-white text-xs font-bold">Terapkan Pemulihan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: Konfirmasi Reset Data */}
      <Modal visible={isResetConfirmOpen} transparent animationType="fade">
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
    </View>
  );
}

