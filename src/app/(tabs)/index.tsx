import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useDashboardFinancials } from '../../hooks/useDashboardFinancials';
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
    budgetMode,
    deleteExpense,
    alarmTime,
    setAlarmTime,
  } = useExpenseStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const {
    expensesToday,
    totalExpenseToday,
    totalExpenseThisMonth,
    totalIncomeThisMonth,
    rawSavingThisMonth,
    totalSavingThisMonth,
    currentCashBalance,
    totalSavingLoan,
  } = useDashboardFinancials(expenses);

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
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <DashboardHeader
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenSettings={() => router.push('/settings')}
        />

        <HeroBalanceCard
          totalExpenseThisMonth={totalExpenseThisMonth}
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalSavingThisMonth={totalSavingThisMonth}
          rawSavingThisMonth={rawSavingThisMonth}
          currentCashBalance={currentCashBalance}
          totalSavingLoan={totalSavingLoan}
          expenses={expenses}
        />

        <SmartAlarmCard
          alarmTime={alarmTime}
          hasTransactionsToday={expensesToday.length > 0}
          onPress={() => setIsAlarmPickerOpen(true)}
        />

        <BudgetWarningCard
          budgetMode={budgetMode}
          monthlyBudget={monthlyBudget}
          totalIncomeThisMonth={totalIncomeThisMonth}
          totalExpenseToday={totalExpenseToday}
          totalExpenseThisMonth={totalExpenseThisMonth}
          totalSavingThisMonth={totalSavingThisMonth}
          currentCashBalance={currentCashBalance}
        />

        <ExpenseHistoryList
          expenses={expensesToday}
          categories={categories}
          onDeleteExpense={deleteExpense}
          onViewAll={() => router.push('/(tabs)/report')}
        />
      </ScrollView>

      <QuickSearchModal
        visible={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        expenses={expenses}
        categories={categories}
      />

      <AlarmPickerModal
        visible={isAlarmPickerOpen}
        currentAlarmTime={alarmTime}
        onClose={() => setIsAlarmPickerOpen(false)}
        onSave={(newTime) => setAlarmTime(newTime)}
      />
    </View>
  );
}
