import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, PieChart, Plus } from 'lucide-react-native';
import BottomSheetInput from '../../components/BottomSheetInput';

export default function TabLayout() {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#18181B', // zinc-900
            borderTopColor: '#27272A', // zinc-800
            borderTopWidth: 1,
            elevation: 12,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            height: Platform.OS === 'ios' ? 84 : 70,
            paddingBottom: Platform.OS === 'ios' ? 24 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarActiveTintColor: '#3B82F6', // blue-500
          tabBarInactiveTintColor: '#71717A', // zinc-500
        }}
      >
        {/* Tab 1: Dashboard */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
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
                onPress={() => setIsBottomSheetVisible(true)}
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
                    backgroundColor: '#2563EB', // blue-600
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 4,
                    borderColor: '#09090B', // zinc-950
                    shadowColor: '#3B82F6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
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
              setIsBottomSheetVisible(true);
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
      <BottomSheetInput 
        visible={isBottomSheetVisible} 
        onClose={() => setIsBottomSheetVisible(false)} 
      />
    </>
  );
}
