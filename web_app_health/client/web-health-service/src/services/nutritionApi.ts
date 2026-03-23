// src/services/nutritionApi.ts

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
}

const NUTRITION_API_BASE = '/api/Nutrition/SearchFoods';
const MEAL_API_BASE = '/api/MealEntries';

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

// 🔥 ОБНОВЛЁННЫЙ МЕТОД: возвращает все порции продукта
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

  // Ищем порцию на 100г для базового расчёта
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
    servings: servings // 🔥 Возвращаем все порции
  };
};

export const searchPersonalFoodHistory = async (
  query: string
): Promise<FoodSearchResult[]> => {
  const today = new Date().toISOString().split('T')[0];
  const response = await fetch(
    `${MEAL_API_BASE}?date=${today}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) return [];

  const entries: any[] = await response.json();

  const filtered = entries
    .filter(e => e.foodName?.toLowerCase().includes(query.toLowerCase()))
    .reduce((acc, curr) => {
      const exists = acc.find((item: any) => item.foodName === curr.foodName);
      if (!exists) acc.push(curr);
      return acc;
    }, [])
    .slice(0, 5)
    .map((entry: any) => {
      const quantity = entry.quantity || 100;
      const ratio = quantity > 0 ? 100 / quantity : 1;

      return {
        source: 'personal' as const,
        personalFoodId: entry.id,
        name: entry.foodName,
        brand: entry.brand,
        caloriesPer100g: Math.round((entry.calories || 0) * ratio),
        proteinPer100g: parseFloat(((entry.protein || 0) * ratio).toFixed(1)),
        carbsPer100g: parseFloat(((entry.carbohydrates || entry.carbs || 0) * ratio).toFixed(1)),
        fatPer100g: parseFloat(((entry.fat || 0) * ratio).toFixed(1)),
        defaultUnit: 'g' as const,
        isDetailsLoaded: true,
        servings: []
      };
    });

  return filtered;
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