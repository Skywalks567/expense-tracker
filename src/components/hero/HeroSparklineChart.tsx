import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { TrendingDown } from 'lucide-react-native';
import { Expense } from '../../types/expense';

type Props = {
  expenses: Expense[];
};

export default function HeroSparklineChart({ expenses }: Props) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });
    return { dateStr, dayName, isToday: i === 6 };
  });

  const dailyAmounts = last7Days.map((day) =>
    expenses
      .filter((e) => e.type === 'expense' && e.date.startsWith(day.dateStr))
      .reduce((sum, e) => sum + e.amount, 0)
  );

  const maxAmount = Math.max(...dailyAmounts, 10000);
  const svgWidth = 300;
  const svgHeight = 55;
  const paddingX = 10;
  const paddingY = 8;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = dailyAmounts.map((amt, idx) => {
    const x = paddingX + (idx / 6) * usableWidth;
    const ratio = amt / maxAmount;
    const y = svgHeight - paddingY - ratio * usableHeight;
    return { x, y };
  });

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
    <View className="my-2 p-2 bg-white/5 rounded-2xl border border-white/10">
      <View className="flex-row justify-between items-center px-1 mb-1">
        <View className="flex-row items-center gap-1.5">
          <TrendingDown size={12} color="#A5B4FC" />
          <Text className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
            Tren Belanja 7 Hari
          </Text>
        </View>
        <Text className="text-[9px] text-slate-400 font-medium">Harian</Text>
      </View>
      <View className="items-center justify-center my-0.5">
        <Svg width={svgWidth} height={svgHeight}>
          <Defs>
            <LinearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
              <Stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#heroGradient)" />
          <Path d={linePath} fill="transparent" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </View>
      <View className="flex-row justify-between px-2 pt-1 border-t border-white/5">
        {last7Days.map((day) => (
          <View key={day.dateStr} className="items-center">
            <Text className={`text-[9px] font-bold ${day.isToday ? 'text-indigo-300' : 'text-slate-400'}`}>
              {day.dayName}
            </Text>
            {day.isToday && <View className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
          </View>
        ))}
      </View>
    </View>
  );
}

