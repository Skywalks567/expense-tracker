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
import { syncSmartAlarm } from '../services/notificationService';

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
    await syncSmartAlarm(time, get().expenses);
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

      await syncSmartAlarm(storedAlarm, storedExpenses);
    } catch (err) {
      console.error('Error initializing SQLite store:', err);
      set({ isLoading: false });
    }
  },

  addExpense: async (amount, categoryId, note, type, source, isSavingLoan) => {
    const { categories, alarmTime, expenses } = get();
    const cat = categories.find((c) => c.id === categoryId);
    const resolvedType = type || cat?.type || 'expense';
    const newExpense: Expense = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount,
      categoryId,
      date: new Date().toISOString(),
      note: note || '',
      type: resolvedType,
      source: resolvedType === 'expense' ? (source || 'cash') : undefined,
      isSavingLoan: resolvedType === 'expense' && source === 'saving' ? !!isSavingLoan : undefined,
    };

    const updated = [newExpense, ...expenses];
    set({ expenses: updated });
    await dbInsertExpense(newExpense);
    await syncSmartAlarm(alarmTime, updated);
  },

  deleteExpense: async (expenseId) => {
    const { alarmTime, expenses } = get();
    const updated = expenses.filter((e) => e.id !== expenseId);
    set({ expenses: updated });
    await dbDeleteExpense(expenseId);
    await syncSmartAlarm(alarmTime, updated);
  },

  resetAllData: async () => {
    const { alarmTime } = get();
    set({ expenses: [] });
    await dbResetExpenses();
    await syncSmartAlarm(alarmTime, []);
  },

  importExpenses: async (importedExpenses) => {
    const valid = importedExpenses.filter((e) => e && e.amount > 0 && e.categoryId);
    if (valid.length === 0) return;
    const { alarmTime, expenses } = get();
    const updated = [...valid, ...expenses];
    set({ expenses: updated });
    await dbImportExpenses(valid);
    await syncSmartAlarm(alarmTime, updated);
  },

  setMonthlyBudget: async (amount) => {
    set({ monthlyBudget: amount });
    await dbSetSetting('monthlyBudget', amount.toString());
  },
}));
