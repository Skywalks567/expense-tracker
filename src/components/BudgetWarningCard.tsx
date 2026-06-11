import { View, Text } from 'react-native';

type Props = {
  monthlyBudget: number;
  totalExpenseToday: number;
};

export default function BudgetWarningCard({ monthlyBudget, totalExpenseToday }: Props) {
  // Hitung jumlah hari di bulan ini
  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  // Hitung jatah harian
  const dailyBudget = Math.floor(monthlyBudget / daysInMonth);
  
  // Kalkulasi persentase
  const percentage = Math.min((totalExpenseToday / dailyBudget) * 100, 100);
  const isOverBudget = totalExpenseToday >= dailyBudget;
  const isNearBudget = percentage > 80 && !isOverBudget;

  // Tentukan warna berdasarkan status
  let barColor = 'bg-blue-500';
  let textColor = 'text-blue-400';
  let message = 'Budget aman terkendali 🎉';

  if (isOverBudget) {
    barColor = 'bg-red-500';
    textColor = 'text-red-400';
    message = 'Waduh! Pengeluaran melebihi batas harian 🚨';
  } else if (isNearBudget) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-400';
    message = 'Hati-hati, sudah mendekati batas harian ⚠️';
  }

  return (
    <View className="bg-zinc-800 p-5 rounded-2xl mb-6">
      <View className="flex-row justify-between mb-2">
        <Text className="text-zinc-400">Jatah Hari Ini</Text>
        <Text className="text-zinc-400">
          <Text className={textColor}>Rp {totalExpenseToday.toLocaleString('id-ID')}</Text> 
          <Text> / Rp {dailyBudget.toLocaleString('id-ID')}</Text>
        </Text>
      </View>

      {/* Progress Bar Container */}
      <View className="h-3 w-full bg-zinc-700 rounded-full overflow-hidden mb-3">
        {/* Progress Fill */}
        <View 
          className={`h-full ${barColor}`} 
          style={{ width: `${percentage}%` }} 
        />
      </View>

      <Text className={`${textColor} text-sm font-medium`}>{message}</Text>
    </View>
  );
}
