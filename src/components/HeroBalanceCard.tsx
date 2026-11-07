import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  TrendingDown,
} from 'lucide-react-native';
import { useExpenseStore, Expense } from '../store/useExpenseStore';

type Props = {
  totalExpenseThisMonth: number;
  totalIncomeThisMonth: number;
  totalSavingThisMonth: number;
  expenses: Expense[];
};

export default function HeroBalanceCard({
  totalExpenseThisMonth,
  totalIncomeThisMonth,
  totalSavingThisMonth,
  expenses,
}: Props) {
  const { isBalanceHidden, toggleBalanceHidden } = useExpenseStore();

  const netBalance = totalIncomeThisMonth - totalExpenseThisMonth;

  // Nama bulan & tahun saat ini dalam Bahasa Indonesia
  const currentMonthYear = new Date().toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  // Kalkulasi data tren pengeluaran 7 hari terakhir
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    return { dateStr, dayName, isToday: i === 6 };
  });

  const dailyAmounts = last7Days.map((day) => {
    return expenses
      .filter((e) => e.type === 'expense' && e.date.startsWith(day.dateStr))
      .reduce((sum, e) => sum + e.amount, 0);
  });

  const maxAmount = Math.max(...dailyAmounts, 10000); // minimal 10rb agar grafik tidak gepeng total
  const minAmount = 0;

  // Koordinat SVG Sparkline
  const svgWidth = 300;
  const svgHeight = 55;
  const paddingX = 10;
  const paddingY = 8;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = dailyAmounts.map((amt, idx) => {
    const x = paddingX + (idx / 6) * usableWidth;
    const ratio = (amt - minAmount) / (maxAmount - minAmount);
    const y = svgHeight - paddingY - ratio * usableHeight;
    return { x, y };
  });

  // Membentuk kurva halus (Smooth Bezier Curve)
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;

  return (
    <View
      className="rounded-3xl p-5 mb-5 shadow-xl relative overflow-hidden border border-indigo-500/20"
      style={{
        backgroundColor: '#0f172a',
      }}
    >
      {/* Decorative Glow Elements */}
      <View
        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-30"
        style={{ backgroundColor: '#6366f1' }}
      />
      <View
        className="absolute -left-8 -top-8 w-28 h-28 rounded-full opacity-20"
        style={{ backgroundColor: '#8b5cf6' }}
      />

      {/* Baris Atas: Label Saldo & Badge Bulan Dinamis */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-[11px] text-indigo-200 font-bold uppercase tracking-wider">
            Sisa Saldo Bulan Ini
          </Text>
          <View className="flex-row items-center gap-2.5 mt-1">
            <Text className="text-2xl font-black tracking-tight text-white">
              {isBalanceHidden
                ? '••••••••'
                : `Rp ${netBalance.toLocaleString('id-ID')}`}
            </Text>
            <TouchableOpacity
              onPress={toggleBalanceHidden}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-1"
            >
              {isBalanceHidden ? (
                <EyeOff size={18} color="#A5B4FC" />
              ) : (
                <Eye size={18} color="#A5B4FC" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Text className="text-[10px] font-extrabold text-indigo-100">
            ● {currentMonthYear}
          </Text>
        </View>
      </View>

      {/* 2. Sparkline Kurva Tren 7 Hari Terakhir */}
      <View className="my-2 p-2 bg-white/5 rounded-2xl border border-white/10">
        <View className="flex-row justify-between items-center px-1 mb-1">
          <View className="flex-row items-center gap-1.5">
            <TrendingDown size={12} color="#A5B4FC" />
            <Text className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
              Tren Belanja 7 Hari
            </Text>
          </View>
          <Text className="text-[9px] text-slate-400 font-medium">
            Harian
          </Text>
        </View>

        {/* SVG Curve */}
        <View className="items-center justify-center my-0.5">
          <Svg width={svgWidth} height={svgHeight}>
            <Defs>
              <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Area Fill Transparan */}
            <Path d={areaPath} fill="url(#heroGradient)" />

            {/* Glowing Stroke Curve Line */}
            <Path
              d={linePath}
              fill="transparent"
              stroke="#818CF8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* 7 Label Hari Ringkas */}
        <View className="flex-row justify-between px-2 pt-1 border-t border-white/5">
          {last7Days.map((day) => (
            <View key={day.dateStr} className="items-center">
              <Text
                className={`text-[9px] font-bold ${
                  day.isToday ? 'text-indigo-300' : 'text-slate-400'
                }`}
              >
                {day.dayName}
              </Text>
              {day.isToday && (
                <View className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 3. Metric Summary Chips (Masuk, Keluar, Ditabung) */}
      <View className="flex-row gap-2 mt-1.5 p-2 bg-white/5 rounded-2xl border border-white/10">
        {/* Masuk */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-emerald-500/20 items-center justify-center">
            <ArrowDownLeft size={13} color="#34D399" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Masuk</Text>
            <Text
              className="text-[11px] font-bold text-emerald-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `+${totalIncomeThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>

        {/* Keluar */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-rose-500/20 items-center justify-center">
            <ArrowUpRight size={13} color="#FB7185" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Keluar</Text>
            <Text
              className="text-[11px] font-bold text-rose-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `-${totalExpenseThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>

        {/* Tabungan */}
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="w-6 h-6 rounded-lg bg-sky-500/20 items-center justify-center">
            <PiggyBank size={13} color="#38BDF8" />
          </View>
          <View className="flex-1">
            <Text className="text-[9px] text-slate-300 font-medium">Nabung</Text>
            <Text
              className="text-[11px] font-bold text-sky-300"
              numberOfLines={1}
            >
              {isBalanceHidden
                ? '••••'
                : `${totalSavingThisMonth.toLocaleString('id-ID')}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
