// src/services/nutritionApi.ts
import axios from "axios";
import type { CreatePersonalFoodDto, PersonalFood } from "../types/personalFood";

export interface FatSecretFoodItem {
  food_id: string;
  food_name: string;
  brand_name?: string;
  serving_size?: string;
  calories?: string;
  protein?: string;
  carbohydrate?: string;
  fat?: string;
}

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

export interface FatSecretFoodDetailsResponse {
  food: {
    food_id: string;
    food_name: string;
    food_type?: string;
    brand_name?: string;
    servings: {
      serving: FatSecretServing[];
    };
  };
}

export interface FoodSearchResult {
  source: 'fatsecret' | 'personal';
  fatSecretFoodId?: string;
  personalFoodId?: number;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultUnit: 'g' | 'ml' | 'pcs';
  servingInfo?: string;
  isDetailsLoaded?: boolean;
  servings?: FatSecretServing[];
  // 🔥 Поля для точного КБЖУ на порцию (для личных продуктов)
  caloriesPerServing?: number;
  proteinPerServing?: number;
  carbsPerServing?: number;
  fatPerServing?: number;
  servingSize?: number;
  servingUnit?: string;
}

const NUTRITION_API_BASE = '/api/Nutrition/SearchFoods';
const MEAL_API_BASE = '/api/MealEntries';
const PERSONAL_FOODS_API_BASE = '/api/PersonalFoods'; // 🔥 Новый базовый путь

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const searchFatSecretFoods = async (
  query: string,
  limit: number = 10
): Promise<FatSecretFoodItem[]> => {
  const response = await fetch(
    `${NUTRITION_API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to search foods');
  }

  const data = await response.json();
  return data?.foods?.food || [];
};

export const getFatSecretFoodDetails = async (
  foodId: string
): Promise<FoodSearchResult> => {
  const response = await fetch(
    `/api/Nutrition/GetFoodDetails/food/${encodeURIComponent(foodId)}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to fetch food details');
  }

  const data: FatSecretFoodDetailsResponse = await response.json();
  const food = data.food;
  const servings = food.servings.serving;

  if (!servings || servings.length === 0) {
    console.warn('No servings found for food', foodId);
    return {
      source: 'fatsecret',
      fatSecretFoodId: food.food_id,
      name: food.food_name,
      brand: food.brand_name,
      caloriesPer100g: 0,
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatPer100g: 0,
      defaultUnit: 'g',
      isDetailsLoaded: true,
      servings: []
    };
  }

  const parseNum = (val: string | undefined): number => {
    if (!val) return 0;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const serving100g = servings.find(s =>
    s.metric_serving_unit === 'g' && Math.abs(parseNum(s.metric_serving_amount) - 100) < 0.01
  ) || servings.find(s => s.metric_serving_unit === 'g') || servings[0];

  const servingGrams = parseNum(serving100g.metric_serving_amount);
  const normalizeTo100g = (value: number, baseGrams: number): number => {
    if (baseGrams <= 0) return 0;
    if (Math.abs(baseGrams - 100) < 0.01) return value;
    return value * (100 / baseGrams);
  };

  return {
    source: 'fatsecret',
    fatSecretFoodId: food.food_id,
    name: food.food_name,
    brand: food.brand_name,
    caloriesPer100g: Math.round(normalizeTo100g(parseNum(serving100g.calories), servingGrams)),
    proteinPer100g: parseFloat(normalizeTo100g(parseNum(serving100g.protein), servingGrams).toFixed(1)),
    carbsPer100g: parseFloat(normalizeTo100g(parseNum(serving100g.carbohydrate), servingGrams).toFixed(1)),
    fatPer100g: parseFloat(normalizeTo100g(parseNum(serving100g.fat), servingGrams).toFixed(1)),
    defaultUnit: (serving100g.metric_serving_unit as 'g' | 'ml' | 'pcs') || 'g',
    servingInfo: serving100g.serving_description,
    isDetailsLoaded: true,
    servings: servings
  };
};

// 🔥 ОБНОВЛЁННЫЙ МЕТОД: ищет в настоящей базе личных продуктов
export const searchPersonalFoodHistory = async (
  query: string
): Promise<FoodSearchResult[]> => {
  try {
    const response = await fetch(
      `${PERSONAL_FOODS_API_BASE}/search?query=${encodeURIComponent(query.trim())}`,
      { headers: getAuthHeaders() }
    );

    if (!response.ok) {
      console.warn('⚠️ Failed to fetch personal foods from backend');
      return [];
    }

    const personalFoods: PersonalFood[] = await response.json();

    // 🔥 Маппим в FoodSearchResult
    return personalFoods.map(mapPersonalToFoodResult);
  } catch (err) {
    console.error('❌ Error searching personal foods:', err);
    return [];
  }
};

// 🔥 НОВАЯ ФУНКЦИЯ: маппинг PersonalFood → FoodSearchResult
export const mapPersonalToFoodResult = (food: any): FoodSearchResult => {
  // 🔥 Пытаемся получить per-serving данные (как должно быть)
  const servingSize = food.servingSize ?? food.servingSizeGrams ?? null;
  const caloriesPerServing = food.caloriesPerServing ?? food.calories ?? null;
  const proteinPerServing = food.proteinPerServing ?? food.protein ?? null;
  const carbsPerServing = food.carbsPerServing ?? food.carbs ?? food.carbohydrate ?? null;
  const fatPerServing = food.fatPerServing ?? food.fat ?? null;

  // 🔥 Если per-serving есть — считаем per-100g
  // Если нет — берём готовые per-100g (как временное решение)
  let caloriesPer100g = food.caloriesPer100g ?? 0;
  let proteinPer100g = food.proteinPer100g ?? 0;
  let carbsPer100g = food.carbsPer100g ?? 0;
  let fatPer100g = food.fatPer100g ?? 0;

  if (servingSize && servingSize > 0 && caloriesPerServing != null) {
    caloriesPer100g = Math.round((caloriesPerServing / servingSize) * 100);
    proteinPer100g = parseFloat(((proteinPerServing ?? 0) / servingSize * 100).toFixed(1));
    carbsPer100g = parseFloat(((carbsPerServing ?? 0) / servingSize * 100).toFixed(1));
    fatPer100g = parseFloat(((fatPerServing ?? 0) / servingSize * 100).toFixed(1));
  }

  const defaultUnit = ['g', 'ml', 'pcs'].includes(food.defaultUnit)
    ? food.defaultUnit
    : 'g';

  return {
    source: 'personal',
    personalFoodId: food.id,
    name: food.name,
    brand: food.brand || undefined,

    // КБЖУ на 100г (для отображения)
    caloriesPer100g,
    proteinPer100g,
    carbsPer100g,
    fatPer100g,

    // 🔥 Per-serving данные (могут быть null, если бэкенд не отдаёт)
    caloriesPerServing,
    proteinPerServing,
    carbsPerServing,
    fatPerServing,
    servingSize,
    servingUnit: food.defaultUnit,

    defaultUnit: defaultUnit as 'g' | 'ml' | 'pcs',
    servingInfo: servingSize ? `${servingSize} ${defaultUnit}` : '100 г',
    isDetailsLoaded: true,
    servings: []
  };
};

export const mapFatSecretToFoodResult = (item: FatSecretFoodItem): FoodSearchResult => {
  return {
    source: 'fatsecret',
    fatSecretFoodId: item.food_id,
    name: item.food_name,
    brand: item.brand_name,
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
    defaultUnit: 'g',
    servingInfo: item.serving_size ? `${item.serving_size}г` : undefined,
    isDetailsLoaded: false,
    servings: []
  };
};

// 🔥 Создание личного продукта (axios, так как нужен POST с телом)
export const createPersonalFood = async (data: CreatePersonalFoodDto): Promise<PersonalFood> => {
  const token = localStorage.getItem('token') || localStorage.getItem('jwt') || localStorage.getItem('authToken');

  const response = await axios.post<PersonalFood>(
    PERSONAL_FOODS_API_BASE,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    }
  );
  return response.data;
};

// 🔥 Получение всех личных продуктов (для управления в настройках)
export const getAllPersonalFoods = async (): Promise<PersonalFood[]> => {
  const response = await fetch(
    PERSONAL_FOODS_API_BASE,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) return [];
  return await response.json();
};

// 🔥 Удаление личного продукта
export const deletePersonalFood = async (id: number): Promise<void> => {
  const response = await fetch(
    `${PERSONAL_FOODS_API_BASE}/${id}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete personal food');
  }
};