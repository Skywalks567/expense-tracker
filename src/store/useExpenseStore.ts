import { create } from 'zustand';
import { collection, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth, loginAnonymously } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { TransactionType, Category, Expense, ExpenseState } from '../types/expense';
import { defaultCategories } from '../constants/categories';
import { fetchOrCreateUserBudget, subscribeToUserExpenses } from './storeHelpers';

export type { TransactionType, Category, Expense, ExpenseState };

let unsubscribeSnapshot: () => void;

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: defaultCategories,
  isLoading: true,
  userId: null,
  monthlyBudget: 3000000,
  alarmTime: '20:00',
  isBalanceHidden: false,
  isInputModalOpen: false,
  inputInitialType: 'expense',
  inputInitialCategoryId: null,

  setAlarmTime: (time) => set({ alarmTime: time }),
  toggleBalanceHidden: () => set((state) => ({ isBalanceHidden: !state.isBalanceHidden })),
  openInputModal: (type = 'expense', categoryId = null) =>
    set({ isInputModalOpen: true, inputInitialType: type, inputInitialCategoryId: categoryId }),
  closeInputModal: () => set({ isInputModalOpen: false, inputInitialCategoryId: null }),

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ userId: user.uid });
        const budget = await fetchOrCreateUserBudget(user.uid);
        set({ monthlyBudget: budget });

        if (unsubscribeSnapshot) unsubscribeSnapshot();
        unsubscribeSnapshot = subscribeToUserExpenses(user.uid, (data) => {
          set({ expenses: data, isLoading: false });
        });
      } else {
        await loginAnonymously();
      }
    });
  },

  addExpense: async (amount, categoryId, note, type) => {
    const { userId, categories } = get();
    if (!userId) return;
    const cat = categories.find((c) => c.id === categoryId);
    await addDoc(collection(db, 'users', userId, 'expenses'), {
      amount,
      categoryId,
      date: new Date().toISOString(),
      note: note || '',
      type: type || cat?.type || 'expense',
    });
  },

  deleteExpense: async (expenseId) => {
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== expenseId) }));
    const { userId } = get();
    if (userId) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'expenses', expenseId));
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  },

  resetAllData: async () => {
    const { userId, expenses } = get();
    set({ expenses: [] });
    if (!userId) return;
    for (const exp of expenses) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'expenses', exp.id));
      } catch {}
    }
  },

  importExpenses: async (importedExpenses) => {
    const { userId } = get();
    const valid = importedExpenses.filter((e) => e && e.amount > 0 && e.categoryId);
    if (valid.length === 0) return;
    set((state) => ({ expenses: [...valid, ...state.expenses] }));
    if (!userId) return;
    for (const item of valid) {
      try {
        await addDoc(collection(db, 'users', userId, 'expenses'), {
          amount: item.amount,
          categoryId: item.categoryId,
          date: item.date || new Date().toISOString(),
          note: item.note || '',
          type: item.type || 'expense',
        });
      } catch {}
    }
  },

  setMonthlyBudget: async (amount) => {
    const { userId } = get();
    if (!userId) return;
    set({ monthlyBudget: amount });
    await setDoc(doc(db, 'users', userId), { monthlyBudget: amount }, { merge: true });
  },
}));
