export interface CreateMealEntryDto {
  entryDate: string;        // Format: "2026-03-22"
  entryTime?: string;       // Format: "08:30:00"
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  foodName: string;
  brand?: string;
  quantity: number;
  unit: 'g' | 'ml' | 'pcs' | 'cup' | 'tbsp' | 'tsp';
  fatSecretFoodId?: string;
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