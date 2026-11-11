import React, { useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useExpenseStore, TransactionType } from '../../store/useExpenseStore';
import ReportHeader from '../../components/report/ReportHeader';
import ReportTabSwitch from '../../components/report/ReportTabSwitch';
import ReportDonutHeroCard from '../../components/report/ReportDonutHeroCard';
import ReportMetricDuo from '../../components/report/ReportMetricDuo';
import MonthlyTransactionList from '../../components/report/MonthlyTransactionList';
import ReportDatePickerModal from '../../components/report/ReportDatePickerModal';
import { getMonthDateRange, formatCustomDateRange, DateRange } from '../../components/report/reportDateUtils';

export default function ReportScreen() {
  const { expenses, categories, deleteExpense } = useExpenseStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>(() => getMonthDateRange(new Date()));
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions'>('summary');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const handlePrevMonth = () => {
    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    setSelectedDate(d);
    setDateRange(getMonthDateRange(d));
  };

  const handleNextMonth = () => {
    const now = new Date();
    if (selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() >= now.getMonth()) return;
    const d = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    setSelectedDate(d);
    setDateRange(getMonthDateRange(d));
  };

  const handleSelectMonth = (d: Date) => {
    setSelectedDate(d);
    setDateRange(getMonthDateRange(d));
  };

  const handleApplyCustom = (start: string, end: string) => {
    setDateRange({
      startDate: start,
      endDate: end,
      label: formatCustomDateRange(start, end),
      isCustom: true,
    });
  };

  const periodExpenses = expenses.filter((e) => {
    const d = e.date.substring(0, 10);
    return d >= dateRange.startDate && d <= dateRange.endDate;
  });

  const totalExpense = periodExpenses.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = periodExpenses.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalSaving = periodExpenses.filter((e) => e.type === 'saving').reduce((sum, e) => sum + e.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round((totalSaving / totalIncome) * 100) : 0;

  const nowStr = new Date().toISOString().substring(0, 10);
  const endEffective = dateRange.endDate < nowStr ? dateRange.endDate : nowStr;
  const startD = new Date(dateRange.startDate);
  const endD = new Date(endEffective);
  const diffDays = Math.max(1, Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const dailyAverage = Math.floor(totalExpense / diffDays);

  const filteredList = periodExpenses.filter((e) => (filterType === 'all' ? true : e.type === filterType));

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1 px-5 pt-12" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <ReportHeader
          currentDate={selectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onOpenPicker={() => setIsPickerOpen(true)}
          label={dateRange.label}
          isCustom={dateRange.isCustom}
        />

        <ReportTabSwitch activeTab={activeTab} onTabChange={setActiveTab} txCount={periodExpenses.length} />

        {activeTab === 'summary' ? (
          <View key="summary-tab-content">
            <ReportDonutHeroCard expenses={periodExpenses} categories={categories} totalExpense={totalExpense} />
            <ReportMetricDuo savingsRate={savingsRate} totalSaving={totalSaving} dailyAverage={dailyAverage} daysCount={diffDays} />
          </View>
        ) : (
          <View key="transactions-tab-content">
            <MonthlyTransactionList transactions={filteredList} categories={categories} filterType={filterType} onFilterChange={setFilterType} onDeleteExpense={deleteExpense} />
          </View>
        )}
      </ScrollView>

      <ReportDatePickerModal
        visible={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedDate={selectedDate}
        onSelectMonthDate={handleSelectMonth}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onApplyCustomRange={handleApplyCustom}
      />
    </View>
  );
}
