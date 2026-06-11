import { create } from 'zustand';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth, loginAnonymously } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  group: string;
};

export type Expense = {
  id: string;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
};

type ExpenseState = {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  userId: string | null;
  monthlyBudget: number;
  initialize: () => void;
  addExpense: (amount: number, categoryId: string, note?: string) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  setMonthlyBudget: (amount: number) => Promise<void>;
};

const defaultCategories: Category[] = [
  // Kebutuhan Pokok
  { id: 'makan_minum', name: 'Makanan & Minuman', icon: '🍔', color: '#F59E0B', group: 'Kebutuhan Pokok' },
  { id: 'belanja_bulanan', name: 'Belanja Bulanan', icon: '🛒', color: '#10B981', group: 'Kebutuhan Pokok' },
  { id: 'tempat_tinggal', name: 'Tempat Tinggal', icon: '🏠', color: '#8B5CF6', group: 'Kebutuhan Pokok' },
  { id: 'tagihan', name: 'Tagihan', icon: '⚡', color: '#EAB308', group: 'Kebutuhan Pokok' },
  
  // Transportasi
  { id: 'bensin', name: 'Bensin', icon: '⛽', color: '#EF4444', group: 'Transportasi' },
  { id: 'ojol', name: 'Ojek Online', icon: '🛵', color: '#3B82F6', group: 'Transportasi' },
  { id: 'transportasi_umum', name: 'Transportasi Umum', icon: '🚌', color: '#06B6D4', group: 'Transportasi' },
  
  // Gaya Hidup
  { id: 'nongkrong', name: 'Nongkrong/Kafe', icon: '☕', color: '#D946EF', group: 'Gaya Hidup' },
  { id: 'belanja', name: 'Belanja', icon: '🛍️', color: '#EC4899', group: 'Gaya Hidup' },
  { id: 'hiburan', name: 'Hiburan', icon: '🎬', color: '#8B5CF6', group: 'Gaya Hidup' },
  { id: 'liburan', name: 'Liburan', icon: '✈️', color: '#0EA5E9', group: 'Gaya Hidup' },
  
  // Kesehatan
  { id: 'obat_klinik', name: 'Obat/Klinik', icon: '💊', color: '#14B8A6', group: 'Kesehatan' },
  { id: 'perawatan_diri', name: 'Perawatan Diri', icon: '💆‍♂️', color: '#F43F5E', group: 'Kesehatan' },
  { id: 'olahraga', name: 'Olahraga', icon: '🏃‍♂️', color: '#84CC16', group: 'Kesehatan' },
  
  // Masa Depan
  { id: 'tabungan', name: 'Tabungan', icon: '💰', color: '#22C55E', group: 'Masa Depan' },
  { id: 'investasi', name: 'Investasi', icon: '📈', color: '#6366F1', group: 'Masa Depan' },
  { id: 'cicilan_hutang', name: 'Cicilan/Hutang', icon: '💳', color: '#F97316', group: 'Masa Depan' },
  { id: 'sosial_sedekah', name: 'Sosial/Sedekah', icon: '🤲', color: '#06B6D4', group: 'Masa Depan' },
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
          const expensesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Expense[];
          set({ expenses: expensesData, isLoading: false });
        });
      } else {
        await loginAnonymously();
      }
    });
  },

  addExpense: async (amount, categoryId, note) => {
    const { userId } = get();
    if (!userId) return;

    const expensesRef = collection(db, 'users', userId, 'expenses');
    await addDoc(expensesRef, {
      amount,
      categoryId,
      date: new Date().toISOString(),
      note: note || '',
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
