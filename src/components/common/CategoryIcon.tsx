import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Home,
  Zap,
  Fuel,
  Bike,
  Bus,
  Coffee,
  ShoppingBag,
  Film,
  Plane,
  Pill,
  Sparkles,
  Activity,
  CreditCard,
  HeartHandshake,
  Tag,
  Briefcase,
  Laptop,
  Gift,
  TrendingUp,
  Banknote,
  ShieldCheck,
  Target,
  LineChart,
  Coins,
  Landmark,
} from 'lucide-react-native';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  makan_minum: Utensils,
  belanja_bulanan: ShoppingCart,
  tempat_tinggal: Home,
  tagihan: Zap,
  bensin: Fuel,
  ojol: Bike,
  transportasi_umum: Bus,
  nongkrong: Coffee,
  belanja: ShoppingBag,
  hiburan: Film,
  liburan: Plane,
  obat_klinik: Pill,
  perawatan_diri: Sparkles,
  olahraga: Activity,
  cicilan_hutang: CreditCard,
  sosial_sedekah: HeartHandshake,
  lainnya: Tag,
  gaji: Briefcase,
  freelance_bisnis: Laptop,
  bonus_thr: Gift,
  passive_income: TrendingUp,
  pemasukan_lain: Banknote,
  dana_darurat: ShieldCheck,
  tabungan_impian: Target,
  saham_reksadana: LineChart,
  emas_mulia: Coins,
  tabungan_umum: Landmark,
};

type Props = {
  categoryId: string;
  size?: number;
  color?: string;
};

export default function CategoryIcon({ categoryId, size = 18, color = '#4F46E5' }: Props) {
  const IconComponent = iconMap[categoryId] || Tag;
  return <IconComponent size={size} color={color} />;
}

