import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, PieChart, Plus } from 'lucide-react-native';
import BottomSheetInput from '../../components/BottomSheetInput';
import { useExpenseStore } from '../../store/useExpenseStore';

export default function TabLayout() {
  const { openInputModal } = useExpenseStore();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E2E8F0', // slate-200
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: '#64748B',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            height: Platform.OS === 'ios' ? 84 : 70,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
          },
          tabBarActiveTintColor: '#4F46E5', // indigo-600
          tabBarInactiveTintColor: '#94A3B8', // slate-400
        }}
      >
        {/* Tab 1: Beranda */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Beranda',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />

        {/* Tab 2: Tombol Tambah (+) Menonjol di Tengah */}
        <Tabs.Screen
          name="action"
          options={{
            title: '',
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => openInputModal('expense')}
                activeOpacity={0.85}
                style={{
                  top: -16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: '#4F46E5', // indigo-600
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 4,
                    borderColor: '#F8FAFC', // slate-50
                    shadowColor: '#4F46E5',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.35,
                    shadowRadius: 8,
                    elevation: 10,
                  }}
                >
                  <Plus color="white" size={28} />
                </View>
              </TouchableOpacity>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openInputModal('expense');
            },
          }}
        />

        {/* Tab 3: Laporan */}
        <Tabs.Screen
          name="report"
          options={{
            title: 'Laporan',
            tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
          }}
        />
      </Tabs>

      {/* Global Bottom Sheet Input Modal */}
      <BottomSheetInput />
    </>
  );
}
