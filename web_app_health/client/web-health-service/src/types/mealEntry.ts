export interface CreateMealEntryDto {
  entryDate: string;
  entryTime?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  foodName: string;
  brand?: string;
  quantity: number;
  unit: 'g' | 'ml' | 'pcs' | 'cup' | 'tbsp' | 'tsp' | 'oz' | 'serving';
  fatSecretFoodId?: string;
  fatSecretServingId?: string; // 🔥 NEW: ID выбранной порции
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  notes?: string;
}

export interface MealEntryResponseDto {
  id: number;
  entryDate: string;
  entryTime?: string;
  mealType: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  notes?: string;
  createdAt: string;
}

export interface DailySummaryDto {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbohydrates: number;
  totalFat: number;
  mealCount: number;
  meals: MealEntryResponseDto[];
}

// 🔥 NEW: Типы для порций FatSecret
export interface FatSecretServing {
  serving_id: string;
  serving_description: string;
  serving_url: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
  number_of_units: string;
  measurement_description: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
}

export interface FatSecretFoodDetails {
  food_id: string;
  food_name: string;
  food_type?: string;
  brand_name?: string;
  servings: FatSecretServing[];
}

export interface FoodSearchResult {
  source: 'fatsecret' | 'personal';
  fatSecretFoodId?: string;
  personalFoodId?: number;
  name: string;
  brand?: string;
  servingSize?: number; 
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultUnit: 'g' | 'ml' | 'pcs';
  servingInfo?: string;
  isDetailsLoaded?: boolean;
  servings?: FatSecretServing[]; // 🔥 NEW: все порции продукта
}