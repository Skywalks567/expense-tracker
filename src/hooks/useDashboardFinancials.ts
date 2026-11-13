import { useMemo } from 'react';
import { Expense } from '../types/expense';

export function useDashboardFinancials(expenses: Expense[]) {
  return useMemo(() => {
    const todayString = new Date().toISOString().split('T')[0];
    const thisMonthString = todayString.substring(0, 7);

    const expensesToday = expenses.filter((e) => e.date.startsWith(todayString));
    const expensesThisMonth = expenses.filter((e) => e.date.startsWith(thisMonthString));

    // Belanja kas hari ini (pengeluaran dari tabungan tidak mengurangi kas harian)
    const totalExpenseToday = expensesToday
      .filter((e) => e.type === 'expense' && e.source !== 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCashExpenseThisMonth = expensesThisMonth
      .filter((e) => e.type === 'expense' && e.source !== 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncomeThisMonth = expensesThisMonth
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const rawSavingThisMonth = expensesThisMonth
      .filter((e) => e.type === 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavingSpentThisMonth = expensesThisMonth
      .filter((e) => e.type === 'expense' && e.source === 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    // Perhitungan akumulasi sepanjang masa (All-time lifetime tracking)
    const totalIncomeAllTime = expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalCashExpenseAllTime = expenses
      .filter((e) => e.type === 'expense' && e.source !== 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavingDepositedAllTime = expenses
      .filter((e) => e.type === 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavingSpentAllTime = expenses
      .filter((e) => e.type === 'expense' && e.source === 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    // Saldo kas riil saat ini (terbawa / rollover otomatis dari bulan-bulan lalu)
    const currentCashBalance = totalIncomeAllTime - totalCashExpenseAllTime - totalSavingDepositedAllTime;

    // Total brankas tabungan terkumpul sepanjang masa (dikurangi yang pernah diambil)
    const lifetimeNetSaving = Math.max(0, totalSavingDepositedAllTime - totalSavingSpentAllTime);

    // Pinjaman ke tabungan yang belum diganti
    const totalSavingLoan = expenses
      .filter((e) => e.type === 'expense' && e.source === 'saving' && e.isSavingLoan)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      expensesToday,
      expensesThisMonth,
      totalExpenseToday,
      totalCashExpenseThisMonth,
      totalExpenseThisMonth: totalCashExpenseThisMonth,
      totalSavingSpentThisMonth,
      totalIncomeThisMonth,
      rawSavingThisMonth,
      totalSavingThisMonth: lifetimeNetSaving,
      monthlyNetSaving: Math.max(0, rawSavingThisMonth - totalSavingSpentThisMonth),
      currentCashBalance,
      lifetimeNetSaving,
      totalSavingLoan,
    };
  }, [expenses]);
}
