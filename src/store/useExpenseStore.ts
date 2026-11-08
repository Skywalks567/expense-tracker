import { create } from 'zustand';
import { TransactionType, Category, Expense, ExpenseState } from '../types/expense';
import { defaultCategories } from '../constants/categories';
import {
  dbGetExpenses,
  dbInsertExpense,
  dbDeleteExpense,
  dbResetExpenses,
  dbImportExpenses,
  dbGetSetting,
  dbSetSetting,
} from '../db/database';
import { scheduleDailyAlarm } from '../services/notificationService';

export type { TransactionType, Category, Expense, ExpenseState };

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: defaultCategories,
  isLoading: true,
  userId: null,
  monthlyBudget: 3000000,
  budgetMode: 'auto',
  alarmTime: '20:00',
  isBalanceHidden: false,
  isInputModalOpen: false,
  inputInitialType: 'expense',
  inputInitialCategoryId: null,

  setAlarmTime: async (time) => {
    set({ alarmTime: time });
    await dbSetSetting('alarmTime', time);
    await scheduleDailyAlarm(time);
  },
  setBudgetMode: async (mode) => {
    set({ budgetMode: mode });
    await dbSetSetting('budgetMode', mode);
  },
  toggleBalanceHidden: () => set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),
  openInputModal: (type = 'expense', categoryId = null) =>
    set({ isInputModalOpen: true, inputInitialType: type, inputInitialCategoryId: categoryId }),
  closeInputModal: () => set({ isInputModalOpen: false, inputInitialCategoryId: null }),

  initialize: async () => {
    try {
      const storedExpenses = await dbGetExpenses();
      const storedBudgetStr = await dbGetSetting('monthlyBudget', '3000000');
      const storedMode = (await dbGetSetting('budgetMode', 'auto')) as 'auto' | 'manual';
      const storedAlarm = await dbGetSetting('alarmTime', '20:00');

      set({
        expenses: storedExpenses,
        monthlyBudget: parseInt(storedBudgetStr, 10) || 3000000,
        budgetMode: storedMode === 'manual' ? 'manual' : 'auto',
        alarmTime: storedAlarm,
        isLoading: false,
      });

      await scheduleDailyAlarm(storedAlarm);
    } catch (err) {
      console.error('Error initializing SQLite store:', err);
      set({ isLoading: false });
    }
  },

  addExpense: async (amount, categoryId, note, type) => {
    const { categories } = get();
    const cat = categories.find((c) => c.id === categoryId);
    const newExpense: Expense = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount,
      categoryId,
      date: new Date().toISOString(),
      note: note || '',
      type: type || cat?.type || 'expense',
    };

    set((state) => ({ expenses: [newExpense, ...state.expenses] }));
    await dbInsertExpense(newExpense);
  },

  deleteExpense: async (expenseId) => {
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== expenseId) }));
    await dbDeleteExpense(expenseId);
  },

  resetAllData: async () => {
    set({ expenses: [] });
    await dbResetExpenses();
  },

  importExpenses: async (importedExpenses) => {
    const valid = importedExpenses.filter((e) => e && e.amount > 0 && e.categoryId);
    if (valid.length === 0) return;
    set((state) => ({ expenses: [...valid, ...state.expenses] }));
    await dbImportExpenses(valid);
  },

  setMonthlyBudget: async (amount) => {
    set({ monthlyBudget: amount });
    await dbSetSetting('monthlyBudget', amount.toString());
  },
}));
