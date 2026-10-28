import { create } from 'zustand';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, loginAnonymously } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type TransactionType = 'expense' | 'income' | 'saving';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  group: string;
  type: TransactionType;
};

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
  type: TransactionType;
};

type ExpenseState = {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  userId: string | null;
  monthlyBudget: number;
  initialize: () => void;
  addExpense: (amount: number, categoryId: string, note?: string, type?: TransactionType) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  setMonthlyBudget: (amount: number) => Promise<void>;
};

const defaultCategories: Category[] = [
  // --- PENGELUARAN (EXPENSE) ---
  // Kebutuhan Pokok
  { id: 'makan_minum', name: 'Makanan & Minuman', icon: '🍔', color: '#F59E0B', group: 'Kebutuhan Pokok', type: 'expense' },
  { id: 'belanja_bulanan', name: 'Belanja Bulanan', icon: '🛒', color: '#10B981', group: 'Kebutuhan Pokok', type: 'expense' },
  { id: 'tempat_tinggal', name: 'Tempat Tinggal', icon: '🏠', color: '#8B5CF6', group: 'Kebutuhan Pokok', type: 'expense' },
  { id: 'tagihan', name: 'Tagihan & Listrik', icon: '⚡', color: '#EAB308', group: 'Kebutuhan Pokok', type: 'expense' },
  
  // Transportasi
  { id: 'bensin', name: 'Bensin', icon: '⛽', color: '#EF4444', group: 'Transportasi', type: 'expense' },
  { id: 'ojol', name: 'Ojek Online', icon: '🛵', color: '#3B82F6', group: 'Transportasi', type: 'expense' },
  { id: 'transportasi_umum', name: 'Transportasi Umum', icon: '🚌', color: '#06B6D4', group: 'Transportasi', type: 'expense' },
  
  // Gaya Hidup
  { id: 'nongkrong', name: 'Nongkrong/Kafe', icon: '☕', color: '#D946EF', group: 'Gaya Hidup', type: 'expense' },
  { id: 'belanja', name: 'Belanja', icon: '🛍️', color: '#EC4899', group: 'Gaya Hidup', type: 'expense' },
  { id: 'hiburan', name: 'Hiburan', icon: '🎬', color: '#8B5CF6', group: 'Gaya Hidup', type: 'expense' },
  { id: 'liburan', name: 'Liburan', icon: '✈️', color: '#0EA5E9', group: 'Gaya Hidup', type: 'expense' },
  
  // Kesehatan
  { id: 'obat_klinik', name: 'Obat/Klinik', icon: '💊', color: '#14B8A6', group: 'Kesehatan', type: 'expense' },
  { id: 'perawatan_diri', name: 'Perawatan Diri', icon: '💆‍♂️', color: '#F43F5E', group: 'Kesehatan', type: 'expense' },
  { id: 'olahraga', name: 'Olahraga', icon: '🏃‍♂️', color: '#84CC16', group: 'Kesehatan', type: 'expense' },
  
  // Kewajiban
  { id: 'cicilan_hutang', name: 'Cicilan/Hutang', icon: '💳', color: '#F97316', group: 'Kewajiban', type: 'expense' },
  { id: 'sosial_sedekah', name: 'Sosial/Sedekah', icon: '🤲', color: '#06B6D4', group: 'Kewajiban', type: 'expense' },

  // --- PEMASUKAN (INCOME) ---
  { id: 'gaji', name: 'Gaji Bulanan', icon: '💼', color: '#10B981', group: 'Pemasukan', type: 'income' },
  { id: 'freelance_bisnis', name: 'Freelance / Bisnis', icon: '💻', color: '#06B6D4', group: 'Pemasukan', type: 'income' },
  { id: 'bonus_thr', name: 'Bonus / THR', icon: '🎁', color: '#F59E0B', group: 'Pemasukan', type: 'income' },
  { id: 'passive_income', name: 'Dividen / Bunga', icon: '📈', color: '#8B5CF6', group: 'Pemasukan', type: 'income' },
  { id: 'pemasukan_lain', name: 'Pemasukan Lain', icon: '💵', color: '#14B8A6', group: 'Pemasukan', type: 'income' },

  // --- TABUNGAN & INVESTASI (SAVING) ---
  { id: 'dana_darurat', name: 'Dana Darurat', icon: '🛡️', color: '#10B981', group: 'Tabungan', type: 'saving' },
  { id: 'tabungan_impian', name: 'Tabungan Impian', icon: '🎯', color: '#3B82F6', group: 'Tabungan', type: 'saving' },
  { id: 'saham_reksadana', name: 'Investasi Saham/Reksadana', icon: '📈', color: '#6366F1', group: 'Tabungan', type: 'saving' },
  { id: 'emas_mulia', name: 'Emas / Logam Mulia', icon: '🪙', color: '#F59E0B', group: 'Tabungan', type: 'saving' },
  { id: 'tabungan_umum', name: 'Tabungan Bank', icon: '💰', color: '#14B8A6', group: 'Tabungan', type: 'saving' },
];

let unsubscribeSnapshot: () => void;

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  expenses: [],
  categories: defaultCategories,
  isLoading: true,
  userId: null,
  monthlyBudget: 3000000, // Default 3 Juta

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        set({ userId: user.uid });
        
        // Ambil data user (termasuk monthly budget)
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().monthlyBudget) {
          set({ monthlyBudget: userDoc.data().monthlyBudget });
        } else {
          // Set default budget ke Firestore
          await setDoc(userDocRef, { monthlyBudget: 3000000 }, { merge: true });
        }

        const expensesRef = collection(db, 'users', user.uid, 'expenses');
        const q = query(expensesRef, orderBy('date', 'desc'));
        
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        
        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const expensesData = snapshot.docs.map(doc => {
            const data = doc.data();
            let itemType: TransactionType = data.type || 'expense';
            // Backward compatibility untuk data lama yang belum memiliki field 'type'
            if (!data.type) {
              if (data.categoryId === 'tabungan' || data.categoryId === 'investasi' || data.categoryId?.includes('saving')) {
                itemType = 'saving';
              }
            }
            return {
              id: doc.id,
              amount: data.amount || 0,
              categoryId: data.categoryId,
              date: data.date,
              note: data.note || '',
              type: itemType,
            };
          }) as Expense[];
          set({ expenses: expensesData, isLoading: false });
        });
      } else {
        await loginAnonymously();
      }
    });
  },

  addExpense: async (amount, categoryId, note, type) => {
    const { userId, categories } = get();
    if (!userId) return;

    const cat = categories.find(c => c.id === categoryId);
    const resolvedType: TransactionType = type || cat?.type || 'expense';

    const expensesRef = collection(db, 'users', userId, 'expenses');
    await addDoc(expensesRef, {
      amount,
      categoryId,
      date: new Date().toISOString(),
      note: note || '',
      type: resolvedType,
    });
  },

  deleteExpense: async (expenseId) => {
    const { userId } = get();
    if (!userId) return;

    const expenseRef = doc(db, 'users', userId, 'expenses', expenseId);
    await deleteDoc(expenseRef);
  },

  setMonthlyBudget: async (amount: number) => {
    const { userId } = get();
    if (!userId) return;

    set({ monthlyBudget: amount });
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, { monthlyBudget: amount }, { merge: true });
  }
}));
