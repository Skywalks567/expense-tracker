export type DateRange = {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;
  isCustom: boolean;
};

export function getMonthDateRange(date: Date): DateRange {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthStr = String(month + 1).padStart(2, '0');
  const lastDay = new Date(year, month + 1, 0).getDate();
  const monthName = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return {
    startDate: `${year}-${monthStr}-01`,
    endDate: `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`,
    label: monthName,
    isCustom: false,
  };
}

export function formatCustomDateRange(startStr: string, endStr: string): string {
  try {
    const s = new Date(startStr);
    const e = new Date(endStr);
    const startFormatted = s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const endFormatted = e.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return `${startStr} - ${endStr}`;
  }
}

