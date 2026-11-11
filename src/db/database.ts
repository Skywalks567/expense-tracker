import * as SQLite from 'expo-sqlite';
import { Expense } from '../types/expense';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('expense_tracker.db');
    await dbInstance.execAsync(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        categoryId TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        type TEXT NOT NULL,
        source TEXT,
        isSavingLoan INTEGER DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    try {
      await dbInstance.execAsync('ALTER TABLE expenses ADD COLUMN source TEXT;');
    } catch {}
    try {
      await dbInstance.execAsync('ALTER TABLE expenses ADD COLUMN isSavingLoan INTEGER DEFAULT 0;');
    } catch {}
  }
  return dbInstance;
}

export async function dbGetExpenses(): Promise<Expense[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: string;
    amount: number;
    categoryId: string;
    date: string;
    note: string | null;
    type: string;
    source: string | null;
    isSavingLoan: number | null;
  }>('SELECT * FROM expenses ORDER BY date DESC');

  return rows.map((r) => ({
    id: r.id,
    amount: r.amount,
    categoryId: r.categoryId,
    date: r.date,
    note: r.note || '',
    type: r.type as Expense['type'],
    source: (r.source === 'saving' ? 'saving' : 'cash') as Expense['source'],
    isSavingLoan: r.isSavingLoan === 1,
  }));
}

export async function dbInsertExpense(exp: Expense): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO expenses (id, amount, categoryId, date, note, type, source, isSavingLoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      exp.id,
      exp.amount,
      exp.categoryId,
      exp.date,
      exp.note || '',
      exp.type,
      exp.source || 'cash',
      exp.isSavingLoan ? 1 : 0,
    ]
  );
}

export async function dbDeleteExpense(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}

export async function dbResetExpenses(): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM expenses');
}

export async function dbImportExpenses(items: Expense[]): Promise<void> {
  const db = await getDatabase();
  for (const exp of items) {
    await db.runAsync(
      'INSERT OR REPLACE INTO expenses (id, amount, categoryId, date, note, type, source, isSavingLoan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        exp.id,
        exp.amount,
        exp.categoryId,
        exp.date,
        exp.note || '',
        exp.type,
        exp.source || 'cash',
        exp.isSavingLoan ? 1 : 0,
      ]
    );
  }
}

export async function dbGetSetting(key: string, defaultVal: string): Promise<string> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', [key]);
  return row ? row.value : defaultVal;
}

export async function dbSetSetting(key: string, val: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, val]);
}
