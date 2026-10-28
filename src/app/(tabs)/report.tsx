import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useExpenseStore, TransactionType } from '../../store/useExpenseStore';
import ExpenseDonutChart from '../../components/ExpenseDonutChart';
import SavingsHealthCard from '../../components/report/SavingsHealthCard';
import CashFlowOverviewCard from '../../components/report/CashFlowOverviewCard';
import CategoryRankingList, { CategoryRankingItem } from '../../components/report/CategoryRankingList';
import MonthlyTransactionList from '../../components/report/MonthlyTransactionList';

export default function ReportScreen() {
  const { expenses, categories, deleteExpense } = useExpenseStore();
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  // Format bulan & tahun saat ini dalam Bahasa Indonesia
  const now = new Date();
  const currentMonthName = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const thisMonthString = now.toISOString().substring(0, 7);

  // Filter transaksi bulan berjalan
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(thisMonthString));

  // Agregasi finansial
  const totalExpense = monthlyExpenses
    .filter(e => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = monthlyExpenses
    .filter(e => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSaving = monthlyExpenses
    .filter(e => e.type === 'saving')
    .reduce((sum, e) => sum + e.amount, 0);

  const savingsRate = totalIncome > 0 ? Math.round((totalSaving / totalIncome) * 100) : 0;

  // Filter daftar transaksi bulan ini
  const filteredList = monthlyExpenses.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  // Ranking Kategori Pengeluaran Terbesar
  const expenseRankings: CategoryRankingItem[] = categories
    .filter(c => c.type === 'expense')
    .map(cat => {
      const total = monthlyExpenses
        .filter(e => e.categoryId === cat.id && e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0);
      const percentage = totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0;
      return { ...cat, total, percentage };
    })
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView 
        className="flex-1 px-6 pt-16" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Laporan */}
        <View className="mb-6">
          <Text className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">
            Laporan Finansial
          </Text>
          <Text className="text-white text-3xl font-extrabold">{currentMonthName}</Text>
        </View>

        {/* 1. Evaluasi Rasio Tabungan */}
        <SavingsHealthCard savingsRate={savingsRate} totalSaving={totalSaving} />

        {/* 2. Arus Kas Bulanan */}
        <CashFlowOverviewCard 
          totalIncome={totalIncome} 
          totalExpense={totalExpense} 
          totalSaving={totalSaving} 
        />

        {/* 3. Grafik Donut & Ranking Pengeluaran */}
        <View className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-6">
          <Text className="text-white font-bold text-base mb-1">Distribusi Pengeluaran</Text>
          <Text className="text-zinc-400 text-xs mb-3">Persentase pengeluaran berdasarkan kategori</Text>
          
          <ExpenseDonutChart 
            expenses={monthlyExpenses.filter(e => e.type === 'expense')} 
            categories={categories} 
            totalExpense={totalExpense} 
          />

          <CategoryRankingList rankings={expenseRankings} />
        </View>

        {/* 4. Daftar Riwayat Transaksi Bulanan */}
        <MonthlyTransactionList 
          transactions={filteredList}
          categories={categories}
          filterType={filterType}
          onFilterChange={setFilterType}
          onDeleteExpense={deleteExpense}
        />
      </ScrollView>
    </View>
  );
}
