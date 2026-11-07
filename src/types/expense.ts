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

export type ExpenseState = {
  expenses: Expense[];
  categories: Category[];
  isLoading: boolean;
  userId: string | null;
  monthlyBudget: number;
  alarmTime: string;
  isBalanceHidden: boolean;
  isInputModalOpen: boolean;
  inputInitialType: TransactionType;
  inputInitialCategoryId: string | null;
  initialize: () => void;
  addExpense: (
    amount: number,
    categoryId: string,
    note?: string,
    type?: TransactionType
  ) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  setMonthlyBudget: (amount: number) => Promise<void>;
  setAlarmTime: (time: string) => void;
  toggleBalanceHidden: () => void;
  openInputModal: (type?: TransactionType, categoryId?: string | null) => void;
  closeInputModal: () => void;
  resetAllData: () => Promise<void>;
  importExpenses: (importedExpenses: Expense[]) => Promise<void>;
};

