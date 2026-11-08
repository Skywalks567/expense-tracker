import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Category, TransactionType } from '../../types/expense';
import { inputTypeConfigs } from '../../constants/inputConfig';

type Props = {
  categories: Category[];
  activeType: TransactionType;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
};

export default function InputCategorySelector({
  categories,
  activeType,
  selectedCategoryId,
  onSelectCategory,
}: Props) {
  const filteredCategories = categories.filter((c) => c.type === activeType);
  const currentConfig = inputTypeConfigs[activeType];

  const grouped = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  return (
    <ScrollView className="mb-4 flex-1" showsVerticalScrollIndicator={false}>
      {Object.entries(grouped).map(([groupName, groupCats]) => (
        <View key={groupName} className="mb-4">
          <Text className="text-slate-400 text-[10px] mb-2 font-extrabold uppercase tracking-wider">
            {groupName}
          </Text>
          <View className="flex-row flex-wrap">
            {groupCats.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => onSelectCategory(cat.id)}
                  className={`items-center justify-center p-2 rounded-2xl mr-2 mb-2 border-2 ${
                    isSelected ? currentConfig.selectedCatStyle : 'border-slate-200 bg-slate-50'
                  }`}
                  style={{ width: '22%', minWidth: 70, height: 75 }}
                >
                  <Text className="text-2xl mb-1">{cat.icon}</Text>
                  <Text className="text-slate-700 text-[10px] font-bold text-center" numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

