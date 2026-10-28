import { View, Text, TouchableOpacity } from 'react-native';
import { Settings, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react-native';

type Props = {
  totalExpenseThisMonth: number;
  totalIncomeThisMonth?: number;
  totalSavingThisMonth?: number;
  onEditBudget: () => void;
};

export default function DashboardHeader({ 
  totalExpenseThisMonth, 
  totalIncomeThisMonth = 0, 
  totalSavingThisMonth = 0, 
  onEditBudget 
}: Props) {
  const netBalance = totalIncomeThisMonth - totalExpenseThisMonth;

  return (
    <View className="mb-6">
      {/* Baris Atas: Sisa Saldo / Cashflow & Pengaturan */}
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Text className="text-zinc-400 text-xs uppercase tracking-wider mb-1 font-semibold">
            Sisa Saldo Bulan Ini
          </Text>
          <Text className={`text-3xl font-extrabold ${netBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            Rp {netBalance.toLocaleString('id-ID')}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={onEditBudget}
          className="bg-zinc-800/90 p-3 rounded-2xl border border-zinc-700/50"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Settings color="#9CA3AF" size={20} />
        </TouchableOpacity>
      </View>

      {/* Baris Bawah: 3 Kartu Mini Ringkasan (Pemasukan, Pengeluaran, Tabungan) */}
      <View className="flex-row gap-2">
        {/* Pemasukan */}
        <View className="flex-1 bg-emerald-950/40 border border-emerald-500/20 p-2.5 rounded-2xl">
          <View className="flex-row items-center mb-1">
            <TrendingUp size={14} color="#34D399" />
            <Text className="text-emerald-400 text-[11px] font-bold ml-1">Masuk</Text>
          </View>
          <Text className="text-emerald-300 font-bold text-xs" numberOfLines={1}>
            +Rp {totalIncomeThisMonth.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Pengeluaran */}
        <View className="flex-1 bg-rose-950/40 border border-rose-500/20 p-2.5 rounded-2xl">
          <View className="flex-row items-center mb-1">
            <TrendingDown size={14} color="#FB7185" />
            <Text className="text-rose-400 text-[11px] font-bold ml-1">Keluar</Text>
          </View>
          <Text className="text-rose-300 font-bold text-xs" numberOfLines={1}>
            -Rp {totalExpenseThisMonth.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Tabungan */}
        <View className="flex-1 bg-blue-950/40 border border-blue-500/20 p-2.5 rounded-2xl">
          <View className="flex-row items-center mb-1">
            <PiggyBank size={14} color="#60A5FA" />
            <Text className="text-blue-400 text-[11px] font-bold ml-1">Ditabung</Text>
          </View>
          <Text className="text-blue-300 font-bold text-xs" numberOfLines={1}>
            Rp {totalSavingThisMonth.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </View>
  );
}
