import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';

// Import Store
import { useExpenseStore } from '../../store/useExpenseStore';

// Import Komponen Modular
import DashboardHeader from '../../components/DashboardHeader';
import HeroBalanceCard from '../../components/HeroBalanceCard';
import SmartAlarmCard from '../../components/SmartAlarmCard';
import BudgetWarningCard from '../../components/BudgetWarningCard';
import CategoryQuickChips from '../../components/CategoryQuickChips';
import ExpenseHistoryList from '../../components/ExpenseHistoryList';
import AlarmPickerModal from '../../components/AlarmPickerModal';

export default function HomeScreen() {
  const {
    initialize,
    expenses,
    categories,
    isLoading,
    monthlyBudget,
    setMonthlyBudget,
    deleteExpense,
    alarmTime,
    setAlarmTime,
    openInputModal,
  } = useExpenseStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Kalkulasi data hari ini & bulan ini
  const todayString = new Date().toISOString().split('T')[0];
  const thisMonthString = todayString.substring(0, 7); // Format: "YYYY-MM"

  const expensesToday = expenses.filter((e) => e.date.startsWith(todayString));
  const expensesThisMonth = expenses.filter((e) => e.date.startsWith(thisMonthString));

  // Pengeluaran murni (expense) untuk budget tracking
  const totalExpenseToday = expensesToday
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenseThisMonth = expensesThisMonth
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  // Total Pemasukan & Tabungan bulan ini
  const totalIncomeThisMonth = expensesThisMonth
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSavingThisMonth = expensesThisMonth
    .filter((e) => e.type === 'saving')
    .reduce((sum, e) => sum + e.amount, 0);

  // State untuk modal edit budget & alarm
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(monthlyBudget.toString());
  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);

  const handleEditBudget = () => {
    setTempBudgetInput(monthlyBudget.toString());
    setIsBudgetModalVisible(true);
  };

  const handleSaveBudget = () => {
    const num = parseInt(tempBudgetInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setMonthlyBudget(num);
    }
    setIsBudgetModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 1. Header Bar: Sapaan Waktu Dinamis + Tanggal + Bell Alarm */}
        <DashboardHeader
          onOpenAlarm={() => setIsAlarmModalOpen(true)}
          hasUnrecordedToday={expensesToday.length === 0}
        />

        {/* 2. Hero Card Saldo: Midnight Indigo Theme + Toggle Mata + Metric Chips */}
        <HeroBalanceCard
          totalExpenseThisMonth={totalExpenseThisMonth}
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalSavingThisMonth={totalSavingThisMonth}
          onQuickAdd={(type) => openInputModal(type)}
          onOpenAlarm={() => setIsAlarmModalOpen(true)}
        />

        {/* 3. Smart Alarm Widget: Status Dinamis Aktif vs Selesai */}
        <SmartAlarmCard
          alarmTime={alarmTime}
          hasTransactionsToday={expensesToday.length > 0}
          onOpenSettings={() => setIsAlarmModalOpen(true)}
        />

        {/* 4. Batas Pengeluaran Harian */}
        <BudgetWarningCard
          monthlyBudget={monthlyBudget}
          totalExpenseToday={totalExpenseToday}
          onEditBudget={handleEditBudget}
        />

        {/* 5. Kategori Pilihan Cepat */}
        <CategoryQuickChips
          onSelectCategory={(catId) => openInputModal('expense', catId)}
          onViewAll={() => openInputModal('expense')}
        />

        {/* 6. Transaksi Hari Ini */}
        <ExpenseHistoryList
          expenses={expensesToday}
          categories={categories}
          onDeleteExpense={deleteExpense}
        />
      </ScrollView>

      {/* Modal Pengatur Jam Alarm */}
      <AlarmPickerModal
        visible={isAlarmModalOpen}
        currentAlarmTime={alarmTime}
        onClose={() => setIsAlarmModalOpen(false)}
        onSave={(newTime) => setAlarmTime(newTime)}
      />

      {/* Modal Edit Budget Bulanan (Neo Fintech Light Theme) */}
      <Modal visible={isBudgetModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
          <View className="bg-white border border-slate-200 w-full p-6 rounded-3xl shadow-2xl">
            <Text className="text-slate-900 text-lg font-extrabold mb-1">
              Batas Budget Bulanan
            </Text>
            <Text className="text-slate-500 text-xs mb-5">
              Tentukan batas maksimal pengeluaran Anda per bulan untuk membagi jatah harian.
            </Text>

            <View className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 mb-5">
              <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                Nominal Budget (Rp)
              </Text>
              <TextInput
                className="text-slate-900 text-2xl font-black p-0"
                keyboardType="numeric"
                value={tempBudgetInput}
                onChangeText={setTempBudgetInput}
                autoFocus
              />
            </View>

            <View className="flex-row justify-end gap-2.5">
              <TouchableOpacity
                onPress={() => setIsBudgetModalVisible(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200"
              >
                <Text className="text-slate-500 text-xs font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveBudget}
                className="bg-indigo-600 px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-300"
              >
                <Text className="text-white text-xs font-bold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
