import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useExpenseStore, Expense } from '../store/useExpenseStore';
import BudgetSection from '../components/settings/BudgetSection';
import BackupRestoreSection from '../components/settings/BackupRestoreSection';
import ExportBackupModal from '../components/settings/ExportBackupModal';
import ImportRestoreModal from '../components/settings/ImportRestoreModal';
import ResetConfirmModal from '../components/settings/ResetConfirmModal';

export default function SettingsScreen() {
  const router = useRouter();
  const { monthlyBudget, setMonthlyBudget, expenses, resetAllData, importExpenses } = useExpenseStore();

  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportJson, setExportJson] = useState('');
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importErr, setImportErr] = useState<string | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleSaveBudget = () => {
    const num = parseInt(tempBudget.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num) && num > 0) {
      setMonthlyBudget(num);
      showSuccess('Batas budget berhasil disimpan');
    }
  };

  const handleOpenExport = () => {
    try {
      setExportJson(JSON.stringify(expenses, null, 2));
      setIsExportOpen(true);
    } catch {
      Alert.alert('Gagal', 'Terjadi kesalahan saat memproses data cadangan.');
    }
  };

  const handleExecuteImport = async () => {
    setImportErr(null);
    try {
      const parsed = JSON.parse(importInput);
      if (!Array.isArray(parsed)) throw new Error();
      const valid: Expense[] = parsed.filter((it: any) => it && typeof it.amount === 'number' && it.categoryId);
      if (valid.length === 0) {
        setImportErr('Tidak ditemukan transaksi valid di dalam data.');
        return;
      }
      await importExpenses(valid);
      setIsImportOpen(false);
      setImportInput('');
      showSuccess(`Berhasil memulihkan ${valid.length} transaksi`);
    } catch {
      setImportErr('Format JSON tidak valid atau rusak.');
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View className="px-5 pt-12 pb-4 bg-white border-b border-slate-200/80 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center border border-slate-200/60"
        >
          <ArrowLeft size={18} color="#334155" />
        </TouchableOpacity>
        <Text className="text-slate-900 font-extrabold text-base">Pengaturan</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-5" showsVerticalScrollIndicator={false}>
        {successMsg && (
          <View className="bg-emerald-50 border border-emerald-200 py-3 px-4 rounded-2xl flex-row items-center gap-2.5 mb-5 shadow-sm">
            <CheckCircle2 size={18} color="#059669" />
            <Text className="text-emerald-800 text-xs font-bold">{successMsg}</Text>
          </View>
        )}

        <BudgetSection budgetInput={tempBudget} onChangeBudget={setTempBudget} onSave={handleSaveBudget} />
        <BackupRestoreSection totalRecords={expenses.length} onExport={handleOpenExport} onImport={() => { setImportErr(null); setImportInput(''); setIsImportOpen(true); }} />

        <View className="bg-white border border-slate-200/90 rounded-3xl p-5 mb-6 shadow-sm">
          <Text className="text-rose-600 font-extrabold text-xs uppercase tracking-wider mb-1.5">Zona Bahaya</Text>
          <Text className="text-slate-400 text-xs mb-4">Menghapus permanen seluruh riwayat transaksi.</Text>
          <TouchableOpacity onPress={() => setIsResetOpen(true)} className="bg-rose-50 border border-rose-200 py-3.5 px-4 rounded-2xl flex-row items-center justify-center gap-2">
            <Trash2 size={16} color="#E11D48" />
            <Text className="text-rose-600 text-xs font-bold">Hapus Seluruh Data Catatan</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center pb-8"><Text className="text-slate-400 text-xs font-semibold">Versi 1.0.0</Text></View>
      </ScrollView>

      <ExportBackupModal visible={isExportOpen} exportJsonString={exportJson} onClose={() => setIsExportOpen(false)} />
      <ImportRestoreModal visible={isImportOpen} importJsonInput={importInput} importError={importErr} onChangeInput={setImportInput} onClose={() => setIsImportOpen(false)} onSubmit={handleExecuteImport} />
      <ResetConfirmModal visible={isResetOpen} onClose={() => setIsResetOpen(false)} onConfirm={async () => { await resetAllData(); setIsResetOpen(false); showSuccess('Seluruh catatan direset'); }} />
    </View>
  );
}
