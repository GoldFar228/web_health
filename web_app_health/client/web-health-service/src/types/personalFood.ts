// src/types/personalFood.ts

export interface CreatePersonalFoodDto {
  name: string;
  brand?: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  servingSize: number;
  defaultUnit: 'g' | 'ml' | 'pcs' | 'kg' | 'l' | 'tbsp' | 'tsp' | 'cup' | 'slice' | 'pack';
  autoCalculateCalories: boolean;
}

export interface PersonalFood {
  id: number;
  userId: string;
  name: string;
  brand?: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  caloriesPer100g?: number;  // 🔥 ДОБАВИТЬ
  proteinPer100g?: number;   // 🔥 ДОБАВИТЬ
  carbsPer100g?: number;     // 🔥 ДОБАВИТЬ
  fatPer100g?: number;       // 🔥 ДОБАВИТЬ
  servingSize: number;
  defaultUnit: string;
  autoCalculateCalories: boolean;
  createdAt: string;
  updatedAt: string;
}

export const COMMON_UNITS: Array<{ value: CreatePersonalFoodDto['defaultUnit']; label: string }> = [
  { value: 'g', label: 'грамм (г)' },
  { value: 'ml', label: 'миллилитр (мл)' },
  { value: 'pcs', label: 'штука (шт)' },
  { value: 'kg', label: 'килограмм (кг)' },
  { value: 'l', label: 'литр (л)' },
  { value: 'tbsp', label: 'столовая ложка (ст. л.)' },
  { value: 'tsp', label: 'чайная ложка (ч. л.)' },
  { value: 'cup', label: 'стакан (250 мл)' },
  { value: 'slice', label: 'ломтик' },
  { value: 'pack', label: 'упаковка' },
];