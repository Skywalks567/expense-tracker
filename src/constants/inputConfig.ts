import { TransactionType } from '../types/expense';

export type TypeConfigItem = {
  title: string;
  activeTabBg: string;
  activeTabText: string;
  selectedCatStyle: string;
  btnBg: string;
  btnText: string;
  notePlaceholder: string;
};

export const inputTypeConfigs: Record<TransactionType, TypeConfigItem> = {
  expense: {
    title: 'Catat Pengeluaran',
    activeTabBg: 'bg-white border-rose-300',
    activeTabText: 'text-rose-600',
    selectedCatStyle: 'border-rose-500 bg-rose-50',
    btnBg: 'bg-rose-600',
    btnText: 'Simpan Pengeluaran',
    notePlaceholder: 'Makan siang, bensin, belanja bulanan...',
  },
  income: {
    title: 'Catat Pemasukan',
    activeTabBg: 'bg-white border-emerald-300',
    activeTabText: 'text-emerald-600',
    selectedCatStyle: 'border-emerald-500 bg-emerald-50',
    btnBg: 'bg-emerald-600',
    btnText: 'Simpan Pemasukan',
    notePlaceholder: 'Gaji kantor, hasil freelance, bonus...',
  },
  saving: {
    title: 'Catat Tabungan / Investasi',
    activeTabBg: 'bg-white border-sky-300',
    activeTabText: 'text-sky-600',
    selectedCatStyle: 'border-sky-500 bg-sky-50',
    btnBg: 'bg-sky-600',
    btnText: 'Simpan Tabungan',
    notePlaceholder: 'Setor dana darurat, beli reksadana, tabungan impian...',
  },
};

