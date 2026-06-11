import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Modal, TextInput, Text } from 'react-native';
import { Plus } from 'lucide-react-native';

// Import Store
import { useExpenseStore } from '../../store/useExpenseStore';

// Import Komponen Modular
import DashboardHeader from '../../components/DashboardHeader';
import BudgetWarningCard from '../../components/BudgetWarningCard';
import ExpenseDonutChart from '../../components/ExpenseDonutChart';
import ExpenseHistoryList from '../../components/ExpenseHistoryList';
import BottomSheetInput from '../../components/BottomSheetInput';

export default function HomeScreen() {
  const { 
    initialize, 
    expenses, 
    categories, 
    isLoading, 
    monthlyBudget,
    setMonthlyBudget,
    deleteExpense 
  } = useExpenseStore();

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Kalkulasi data hari ini & bulan ini
  const todayString = new Date().toISOString().split('T')[0];
  const thisMonthString = todayString.substring(0, 7); // Format: "YYYY-MM"

  const expensesToday = expenses.filter(e => e.date.startsWith(todayString));
  const expensesThisMonth = expenses.filter(e => e.date.startsWith(thisMonthString));

  const totalExpenseToday = expensesToday.reduce((sum, e) => sum + e.amount, 0);
  const totalExpenseThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);

  // State untuk modal edit budget (karena Alert.prompt hanya jalan di iPhone)
  const [isBudgetModalVisible, setIsBudgetModalVisible] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(monthlyBudget.toString());

  const handleEditBudget = () => {
    setTempBudgetInput(monthlyBudget.toString());
    setIsBudgetModalVisible(true);
  };

  const handleSaveBudget = () => {
    const num = parseInt(tempBudgetInput.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(num)) {
      setMonthlyBudget(num);
    }
    setIsBudgetModalVisible(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-zinc-950">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-950 px-6 pt-16">
      
      {/* 1. Header & Edit Budget */}
      <DashboardHeader 
        totalExpenseThisMonth={totalExpenseThisMonth} 
        onEditBudget={handleEditBudget} 
      />

      {/* 2. Visualisasi Budget Harian (Merah/Hijau/Kuning) */}
      <BudgetWarningCard 
        monthlyBudget={monthlyBudget} 
        totalExpenseToday={totalExpenseToday} 
      />

      {/* 3. Grafik Donut Pembagian Kategori Bulan Ini */}
      <ExpenseDonutChart 
        expenses={expensesThisMonth} 
        categories={categories} 
        totalExpense={totalExpenseThisMonth} 
      />

      {/* 4. Daftar Riwayat Hari Ini */}
      <ExpenseHistoryList 
        expenses={expensesToday} 
        categories={categories} 
        onDeleteExpense={deleteExpense} 
      />

      {/* 5. Tombol Plus Melayang (Floating Action Button) */}
      <View className="absolute bottom-10 self-center z-50" style={{ elevation: 10 }}>
        <TouchableOpacity 
          onPress={() => setIsBottomSheetVisible(true)}
          className="bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-blue-500/50"
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>
      </View>

      {/* 6. Panel Input Bottom Sheet (Menggunakan Modal Bawaan) */}
      <BottomSheetInput 
        visible={isBottomSheetVisible} 
        onClose={() => setIsBottomSheetVisible(false)} 
      />

      {/* 7. Modal Edit Budget Bulanan (Support Android & iOS) */}
      <Modal
        visible={isBudgetModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/70 justify-center items-center px-6">
          <View className="bg-zinc-900 w-full p-6 rounded-3xl">
            <Text className="text-white text-xl font-bold mb-2">Edit Budget Bulanan</Text>
            <Text className="text-zinc-400 text-sm mb-6">Tentukan batas maksimal pengeluaran Anda per bulan.</Text>
            
            <View className="bg-zinc-800 rounded-2xl px-4 py-3 mb-6">
              <Text className="text-zinc-500 text-xs mb-1">Nominal Budget (Rp)</Text>
              <TextInput
                className="text-white text-2xl font-bold"
                keyboardType="numeric"
                value={tempBudgetInput}
                onChangeText={setTempBudgetInput}
                autoFocus
              />
            </View>

            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity onPress={() => setIsBudgetModalVisible(false)} className="px-4 py-3">
                <Text className="text-zinc-400 font-bold">Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveBudget} className="bg-blue-600 px-6 py-3 rounded-full">
                <Text className="text-white font-bold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
