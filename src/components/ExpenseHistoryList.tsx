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
      <Text className="text-xl font-bold text-white mb-4">Riwayat Pengeluaran</Text>
      
      {expenses.length === 0 ? (
        <Text className="text-zinc-500 italic">Belum ada pengeluaran yang dicatat.</Text>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const category = categories.find(c => c.id === item.categoryId);
            return (
              <View className="flex-row justify-between items-center bg-zinc-800 p-4 rounded-2xl mb-3">
                <View className="flex-row items-center">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: (category?.color || '#000') + '20' }}
                  >
                    <Text className="text-2xl">{category?.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">{category?.name}</Text>
                    {item.note ? (
                      <Text className="text-zinc-400 text-sm">{item.note}</Text>
                    ) : null}
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-red-400 font-bold text-lg">
                    - Rp {item.amount.toLocaleString('id-ID')}
                  </Text>
                  <TouchableOpacity onPress={() => onDeleteExpense(item.id)}>
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
