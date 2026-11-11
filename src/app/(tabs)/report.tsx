import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useExpenseStore, TransactionType } from '../../store/useExpenseStore';
import ReportHeader from '../../components/report/ReportHeader';
import ReportTabSwitch from '../../components/report/ReportTabSwitch';
import ReportDonutHeroCard from '../../components/report/ReportDonutHeroCard';
import ReportMetricDuo from '../../components/report/ReportMetricDuo';
import MonthlyTransactionList from '../../components/report/MonthlyTransactionList';

export default function ReportScreen() {
  const { expenses, categories, deleteExpense } = useExpenseStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions'>('summary');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const monthString = `${year}-${String(month + 1).padStart(2, '0')}`;

  const handlePrevMonth = () => setSelectedDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setSelectedDate(new Date(year, month + 1, 1));

  const monthlyExpenses = expenses.filter((e) => e.date.startsWith(monthString));

  const totalExpense = monthlyExpenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = monthlyExpenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSaving = monthlyExpenses
    .filter((e) => e.type === 'saving')
    .reduce((sum, e) => sum + e.amount, 0);

  const savingsRate = totalIncome > 0 ? Math.round((totalSaving / totalIncome) * 100) : 0;

  const isCurrentMonth = new Date().getFullYear() === year && new Date().getMonth() === month;
  const daysPassed = isCurrentMonth ? Math.max(1, new Date().getDate()) : new Date(year, month + 1, 0).getDate();
  const dailyAverage = Math.floor(totalExpense / daysPassed);

  const filteredList = monthlyExpenses.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1 px-5 pt-12"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ReportHeader
          currentDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        <ReportTabSwitch
          activeTab={activeTab}
          onTabChange={setActiveTab}
          txCount={monthlyExpenses.length}
        />

        {activeTab === 'summary' ? (
          <View key="summary-tab-content">
            <ReportDonutHeroCard
              expenses={monthlyExpenses}
              categories={categories}
              totalExpense={totalExpense}
            />

            <ReportMetricDuo
              savingsRate={savingsRate}
              totalSaving={totalSaving}
              dailyAverage={dailyAverage}
              daysCount={daysPassed}
            />
          </View>
        ) : (
          <View key="transactions-tab-content">
            <MonthlyTransactionList
              transactions={filteredList}
              categories={categories}
              filterType={filterType}
              onFilterChange={setFilterType}
              onDeleteExpense={deleteExpense}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
