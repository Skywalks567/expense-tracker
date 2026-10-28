import { View, Text, TouchableOpacity } from 'react-native';
import { Expense, Category } from '../store/useExpenseStore';
import { ReceiptText } from 'lucide-react-native';

type Props = {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
};

export default function ExpenseHistoryList({ expenses, categories, onDeleteExpense }: Props) {
  return (
    <View className="mt-6 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold text-white">Transaksi Hari Ini</Text>
        <Text className="text-zinc-500 text-xs font-semibold">{expenses.length} transaksi</Text>
      </View>
      
      {expenses.length === 0 ? (
        <View className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl items-center justify-center">
          <View className="w-12 h-12 rounded-2xl bg-zinc-800 items-center justify-center mb-3">
            <ReceiptText size={24} color="#71717A" />
          </View>
          <Text className="text-zinc-300 font-semibold text-sm mb-1">Belum ada transaksi hari ini</Text>
          <Text className="text-zinc-500 text-xs text-center">
            Tekan tombol (+) di bawah untuk mencatat pengeluaran, pemasukan, atau tabunganmu.
          </Text>
        </View>
      ) : (
        expenses.map((item) => {
          const category = categories.find(c => c.id === item.categoryId);
          
          // Format tanda (+) atau (-) dan warna berdasarkan tipe
          const isIncome = item.type === 'income';
          const isSaving = item.type === 'saving';
          
          let sign = '-';
          let amountColor = 'text-rose-400';
          
          if (isIncome) {
            sign = '+';
            amountColor = 'text-emerald-400';
          } else if (isSaving) {
            sign = '';
            amountColor = 'text-blue-400';
          }

          return (
            <View 
              key={item.id} 
              className="flex-row justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-2.5"
            >
              <View className="flex-row items-center flex-1 pr-2">
                <View 
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                  style={{ backgroundColor: (category?.color || '#3B82F6') + '25' }}
                >
                  <Text className="text-2xl">{category?.icon || '💳'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base" numberOfLines={1}>
                    {category?.name || 'Lain-lain'}
                  </Text>
                  {item.note ? (
                    <Text className="text-zinc-400 text-xs mt-0.5" numberOfLines={1}>
                      {item.note}
                    </Text>
                  ) : null}
                </View>
              </View>
              <View className="items-end">
                <Text className={`${amountColor} font-bold text-base`}>
                  {sign} Rp {item.amount.toLocaleString('id-ID')}
                </Text>
                <TouchableOpacity 
                  onPress={() => onDeleteExpense(item.id)} 
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text className="text-zinc-500 text-xs mt-1 underline">Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
