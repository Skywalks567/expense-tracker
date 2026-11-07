import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Expense, TransactionType } from '../types/expense';

export async function fetchOrCreateUserBudget(userId: string): Promise<number> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists() && userDoc.data().monthlyBudget) {
    return userDoc.data().monthlyBudget;
  }
  await setDoc(userDocRef, { monthlyBudget: 3000000 }, { merge: true });
  return 3000000;
}

export function subscribeToUserExpenses(
  userId: string,
  onUpdate: (expenses: Expense[]) => void
): () => void {
  const expensesRef = collection(db, 'users', userId, 'expenses');
  const q = query(expensesRef, orderBy('date', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const expensesData = snapshot.docs.map((docItem) => {
      const data = docItem.data();
      let itemType: TransactionType = data.type || 'expense';
      if (!data.type && (data.categoryId === 'tabungan' || data.categoryId?.includes('saving'))) {
        itemType = 'saving';
      }
      return {
        id: docItem.id,
        amount: data.amount || 0,
        categoryId: data.categoryId,
        date: data.date,
        note: data.note || '',
        type: itemType,
      };
    }) as Expense[];
    onUpdate(expensesData);
  });
}

