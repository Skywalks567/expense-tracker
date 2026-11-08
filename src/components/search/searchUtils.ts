import { Expense, Category } from '../../types/expense';
import { DatePreset } from './SearchDatePresetChips';

export function filterExpensesBySearch(
  expenses: Expense[],
  categories: Category[],
  query: string,
  preset: DatePreset
): Expense[] {
  const trimmed = query.trim().toLowerCase();
  const now = new Date();
  const todayStr = now.toDateString();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return expenses.filter((e) => {
    const d = new Date(e.date);
    if (preset === 'today' && d.toDateString() !== todayStr) return false;
    if (preset === 'yesterday' && d.toDateString() !== yesterdayStr) return false;
    if (preset === '7days' && d.getTime() < sevenDaysAgo.getTime()) return false;
    if (preset === 'month' && (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear)) return false;

    if (!trimmed) return true;

    const cat = categories.find((c) => c.id === e.categoryId);
    const catName = cat?.name.toLowerCase() || '';
    const note = (e.note || '').toLowerCase();
    return catName.includes(trimmed) || note.includes(trimmed) || e.amount.toString().includes(trimmed);
  });
}
