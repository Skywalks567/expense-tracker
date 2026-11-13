import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Category } from '../../types/expense';
import CategoryIcon from '../common/CategoryIcon';

type Props = {
  selectedCategory?: Category;
  onPress: () => void;
};

export default function InputCategoryTileRow({ selectedCategory, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-3 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-9 h-9 rounded-xl items-center justify-center bg-white border border-slate-200">
          <CategoryIcon
            categoryId={selectedCategory?.id || ''}
            color={selectedCategory?.color || '#4F46E5'}
            size={17}
          />
        </View>
        <View>
          <Text className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Kategori
          </Text>
          <Text className="text-xs font-bold text-slate-800 mt-0.5">
            {selectedCategory?.name || 'Pilih Kategori'}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
        <Text className="text-[10px] font-bold text-indigo-600">Pilih</Text>
        <ChevronRight size={12} color="#4F46E5" />
      </View>
    </TouchableOpacity>
  );
}

