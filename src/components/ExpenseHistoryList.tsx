import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Expense, Category } from '../store/useExpenseStore';

type Props = {
  expenses: Expense[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
};

export default function ExpenseHistoryList({ expenses, categories, onDeleteExpense }: Props) {
  return (
    <View className="flex-1 mt-6">
      <Text className="text-xl font-bold text-white mb-4">Riwayat Transaksi Hari Ini</Text>
      
      {expenses.length === 0 ? (
        <Text className="text-zinc-500 italic">Belum ada transaksi yang dicatat hari ini.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
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
              <View className="flex-row justify-between items-center bg-zinc-800/80 p-4 rounded-2xl mb-3 border border-zinc-700/40">
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
                  <TouchableOpacity onPress={() => onDeleteExpense(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text className="text-zinc-500 text-xs mt-1 underline">Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
