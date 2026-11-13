import { Category } from '../types/expense';

export const defaultCategories: Category[] = [
  // --- PENGELUARAN (EXPENSE) ---
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

  // Kesehatan & Kewajiban
  { id: 'obat_klinik', name: 'Obat/Klinik', icon: '💊', color: '#14B8A6', group: 'Kesehatan', type: 'expense' },
  { id: 'perawatan_diri', name: 'Perawatan Diri', icon: '💆‍♂️', color: '#F43F5E', group: 'Kesehatan', type: 'expense' },
  { id: 'olahraga', name: 'Olahraga', icon: '🏃‍♂️', color: '#84CC16', group: 'Kesehatan', type: 'expense' },
  { id: 'cicilan_hutang', name: 'Cicilan/Hutang', icon: '💳', color: '#F97316', group: 'Kewajiban', type: 'expense' },
  { id: 'sosial_sedekah', name: 'Sosial/Sedekah', icon: '🤲', color: '#06B6D4', group: 'Kewajiban', type: 'expense' },
  { id: 'lainnya', name: 'Lainnya', icon: '🏷️', color: '#64748B', group: 'Lainnya', type: 'expense' },

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

