import { useMemo } from 'react';
import { Expense } from '../types/expense';

export function useDashboardFinancials(expenses: Expense[]) {
  return useMemo(() => {
    const todayString = new Date().toISOString().split('T')[0];
    const thisMonthString = todayString.substring(0, 7);

    const expensesToday = expenses.filter((e) => e.date.startsWith(todayString));
    const expensesThisMonth = expenses.filter((e) => e.date.startsWith(thisMonthString));

    const totalExpenseToday = expensesToday
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpenseThisMonth = expensesThisMonth
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalIncomeThisMonth = expensesThisMonth
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalSavingThisMonth = expensesThisMonth
      .filter((e) => e.type === 'saving')
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      expensesToday,
      expensesThisMonth,
      totalExpenseToday,
      totalExpenseThisMonth,
      totalIncomeThisMonth,
      totalSavingThisMonth,
    };
  }, [expenses]);
}

