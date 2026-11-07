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
        type TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
  }
  return dbInstance;
}

export async function dbGetExpenses(): Promise<Expense[]> {
  const db = await getDatabase();
  return await db.getAllAsync<Expense>('SELECT * FROM expenses ORDER BY date DESC');
}

export async function dbInsertExpense(exp: Expense): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO expenses (id, amount, categoryId, date, note, type) VALUES (?, ?, ?, ?, ?, ?)',
    [exp.id, exp.amount, exp.categoryId, exp.date, exp.note || '', exp.type]
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
      'INSERT OR REPLACE INTO expenses (id, amount, categoryId, date, note, type) VALUES (?, ?, ?, ?, ?, ?)',
      [exp.id, exp.amount, exp.categoryId, exp.date, exp.note || '', exp.type]
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

