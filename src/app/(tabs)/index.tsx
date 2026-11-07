import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

// Import Store
import { useExpenseStore } from '../../store/useExpenseStore';

// Import Komponen Modular
import DashboardHeader from '../../components/DashboardHeader';
import HeroBalanceCard from '../../components/HeroBalanceCard';
import SmartAlarmCard from '../../components/SmartAlarmCard';
import BudgetWarningCard from '../../components/BudgetWarningCard';
import ExpenseHistoryList from '../../components/ExpenseHistoryList';
import QuickSearchModal from '../../components/QuickSearchModal';
import AlarmPickerModal from '../../components/AlarmPickerModal';

export default function HomeScreen() {
  const router = useRouter();
  const {
    initialize,
    expenses,
    categories,
    isLoading,
    monthlyBudget,
    deleteExpense,
    alarmTime,
    setAlarmTime,
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

  // State untuk modal pencarian dan pemilih jam alarm
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAlarmPickerOpen, setIsAlarmPickerOpen] = useState(false);

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
        {/* 1. Header Bar: Sapaan Waktu Dinamis + Tanggal + [ 🔍 Cari ] & [ ⚙️ Pengaturan ] */}
        <DashboardHeader
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenSettings={() => router.push('/settings')}
        />

        {/* 2. Hero Card Saldo: Midnight Indigo + Sparkline Tren 7 Hari + 3 Chip Arus Kas */}
        <HeroBalanceCard
          totalExpenseThisMonth={totalExpenseThisMonth}
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalSavingThisMonth={totalSavingThisMonth}
          expenses={expenses}
        />

        {/* 3. Smart Alarm Widget: Status Dinamis (Ketuk untuk Ubah Jam Alarm) */}
        <SmartAlarmCard
          alarmTime={alarmTime}
          hasTransactionsToday={expensesToday.length > 0}
          onPress={() => setIsAlarmPickerOpen(true)}
        />

        {/* 4. Batas Pengeluaran Harian: Spidometer Read-Only */}
        <BudgetWarningCard
          monthlyBudget={monthlyBudget}
          totalExpenseToday={totalExpenseToday}
        />

        {/* 5. Transaksi Hari Ini: Maksimal 3 Transaksi */}
        <ExpenseHistoryList
          expenses={expensesToday}
          categories={categories}
          onDeleteExpense={deleteExpense}
          onViewAll={() => router.push('/(tabs)/report')}
        />
      </ScrollView>

      {/* Modal Pencarian Cepat */}
      <QuickSearchModal
        visible={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        expenses={expenses}
        categories={categories}
      />

      {/* Modal Khusus Pemilih Jam Alarm (Popup Terfokus) */}
      <AlarmPickerModal
        visible={isAlarmPickerOpen}
        currentAlarmTime={alarmTime}
        onClose={() => setIsAlarmPickerOpen(false)}
        onSave={(newTime) => setAlarmTime(newTime)}
      />
    </View>
  );
}
