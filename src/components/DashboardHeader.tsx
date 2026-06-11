import { View, Text, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';

type Props = {
  totalExpenseThisMonth: number;
  onEditBudget: () => void;
};

export default function DashboardHeader({ totalExpenseThisMonth, onEditBudget }: Props) {
  return (
    <View className="flex-row justify-between items-center mb-8">
      <View>
        <Text className="text-zinc-400 text-base mb-1">Total Pengeluaran Bulan Ini</Text>
        <Text className="text-white text-4xl font-bold">
          Rp {totalExpenseThisMonth.toLocaleString('id-ID')}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={onEditBudget}
        className="bg-zinc-800 p-3 rounded-full"
      >
        <Settings color="#9CA3AF" size={24} />
      </TouchableOpacity>
    </View>
  );
}
