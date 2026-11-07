import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react-native';
import { useExpenseStore, Expense } from '../store/useExpenseStore';
import { exportBackupToFile, importBackupFromFile } from '../services/backupService';
import BudgetSection from '../components/settings/BudgetSection';
import BackupRestoreSection from '../components/settings/BackupRestoreSection';
import ResetConfirmModal from '../components/settings/ResetConfirmModal';
import ImportConfirmModal from '../components/settings/ImportConfirmModal';

export default function SettingsScreen() {
  const router = useRouter();
  const { monthlyBudget, setMonthlyBudget, expenses, resetAllData, importExpenses } = useExpenseStore();

  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [pendingImportItems, setPendingImportItems] = useState<Expense[] | null>(null);

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

  const handleExportFile = async () => {
    const success = await exportBackupToFile(expenses);
    if (success) {
      showSuccess('File cadangan siap disimpan / dibagikan');
    } else {
      Alert.alert('Gagal', 'Terjadi kesalahan saat membuat file cadangan.');
    }
  };

  const handleImportFile = async () => {
    const items = await importBackupFromFile();
    if (items && items.length > 0) {
      setPendingImportItems(items);
    } else if (items !== null) {
      Alert.alert('Gagal', 'File cadangan tidak valid atau tidak memiliki catatan transaksi.');
    }
  };

  const handleConfirmImport = async () => {
    if (pendingImportItems) {
      await importExpenses(pendingImportItems);
      showSuccess(`Berhasil memulihkan ${pendingImportItems.length} transaksi`);
      setPendingImportItems(null);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
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
        <BackupRestoreSection totalRecords={expenses.length} onExport={handleExportFile} onImport={handleImportFile} />

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

      <ImportConfirmModal
        visible={!!pendingImportItems}
        itemCount={pendingImportItems ? pendingImportItems.length : 0}
        onClose={() => setPendingImportItems(null)}
        onConfirm={handleConfirmImport}
      />
      <ResetConfirmModal
        visible={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={async () => { await resetAllData(); setIsResetOpen(false); showSuccess('Seluruh catatan direset'); }}
      />
    </View>
  );
}
