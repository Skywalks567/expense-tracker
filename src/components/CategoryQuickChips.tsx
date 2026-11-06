import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Utensils, ShoppingBag, Bus, Zap } from 'lucide-react-native';

type Props = {
  onSelectCategory: (categoryId: string) => void;
  onViewAll: () => void;
};

export default function CategoryQuickChips({ onSelectCategory, onViewAll }: Props) {
  const quickCategories = [
    {
      id: 'makan_minum',
      name: 'Makanan',
      bgColor: 'bg-orange-50',
      iconColor: '#EA580C',
      borderColor: 'border-orange-100',
      icon: <Utensils size={18} color="#EA580C" />,
    },
    {
      id: 'belanja',
      name: 'Belanja',
      bgColor: 'bg-violet-50',
      iconColor: '#7C3AED',
      borderColor: 'border-violet-100',
      icon: <ShoppingBag size={18} color="#7C3AED" />,
    },
    {
      id: 'bensin',
      name: 'Transpor',
      bgColor: 'bg-sky-50',
      iconColor: '#0284C7',
      borderColor: 'border-sky-100',
      icon: <Bus size={18} color="#0284C7" />,
    },
    {
      id: 'tagihan',
      name: 'Tagihan',
      bgColor: 'bg-emerald-50',
      iconColor: '#059669',
      borderColor: 'border-emerald-100',
      icon: <Zap size={18} color="#059669" />,
    },
  ];

  return (
    <View className="mb-5">
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Kategori Pilihan
        </Text>
        <TouchableOpacity onPress={onViewAll} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-[11px] text-indigo-600 font-bold">Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2">
        {quickCategories.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onSelectCategory(item.id)}
            className="flex-1 bg-white border border-slate-200/90 p-2.5 rounded-2xl items-center shadow-sm"
          >
            <View
              className={`w-10 h-10 rounded-xl ${item.bgColor} border ${item.borderColor} items-center justify-center mb-1.5`}
            >
              {item.icon}
            </View>
            <Text className="text-[10px] font-bold text-slate-700">{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

