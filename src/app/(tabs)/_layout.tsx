import { Tabs } from 'expo-router';
import { Home, PieChart } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#18181B', // zinc-900
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#3B82F6', // blue-500
        tabBarInactiveTintColor: '#52525B', // zinc-600
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Laporan',
          tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
