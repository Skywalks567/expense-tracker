import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Category, TransactionType } from '../../types/expense';
import CategoryIcon from '../common/CategoryIcon';

type Props = {
  categories: Category[];
  activeType: TransactionType;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onBack: () => void;
};

export default function CategoryPickerScreen({
  categories,
  activeType,
  selectedCategoryId,
  onSelectCategory,
  onBack,
}: Props) {
  const filtered = categories.filter((c) => c.type === activeType);

  const grouped = filtered.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  return (
    <View className="flex-1 bg-white pt-12 px-5">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 items-center justify-center"
        >
          <ArrowLeft size={18} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-base font-extrabold text-slate-900">Pilih Kategori</Text>
        <View className="w-9" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {Object.entries(grouped).map(([groupName, items]) => (
          <View key={groupName} className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {groupName}
              </Text>
              <View className="flex-1 h-[1px] bg-slate-200/80" />
            </View>

            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden">
              {items.map((cat, idx) => {
                const isSelected = selectedCategoryId === cat.id;
                const isLast = idx === items.length - 1;

                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      onSelectCategory(cat.id);
                      onBack();
                    }}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between p-3 ${
                      isSelected ? 'bg-indigo-50/70' : 'bg-transparent'
                    } ${!isLast ? 'border-b border-slate-100' : ''}`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-9 h-9 rounded-xl items-center justify-center border"
                        style={{
                          backgroundColor: (cat.color || '#4F46E5') + '15',
                          borderColor: (cat.color || '#4F46E5') + '30',
                        }}
                      >
                        <CategoryIcon categoryId={cat.id} color={cat.color || '#4F46E5'} size={17} />
                      </View>
                      <Text className="text-xs font-bold text-slate-800">{cat.name}</Text>
                    </View>

                    {isSelected && <Check size={16} color="#4F46E5" strokeWidth={2.5} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

