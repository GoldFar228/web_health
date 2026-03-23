// src/services/nutritionApi.ts
export interface FatSecretFoodItem {
  food_id: string;
  name: string;
  brand_name?: string;
  serving_size?: string;
  calories?: string;
  protein?: string;
  carbohydrate?: string;
  fat?: string;
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

// Поиск в FatSecret API
export const searchFatSecretFoods = async (
  query: string, 
  limit: number = 10
): Promise<FatSecretFoodItem[]> => {
  const response = await fetch(
    // 🔥 Теперь формируем: /api/Nutrition/SearchFoods/search
    `${NUTRITION_API_BASE}/search?query=${encodeURIComponent(query)}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to search foods');
  }
  
  const data = await response.json();
  // FatSecret возвращает структуру: { foods: { food: [...] } }
  return data?.foods?.food || [];
};

// Поиск в истории питания пользователя (фоллбэк)
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
  
  // Фильтруем и группируем уникальные продукты по имени
  const filtered = entries
    .filter(e => e.foodName?.toLowerCase().includes(query.toLowerCase()))
    .reduce((acc, curr) => {
      const exists = acc.find((item: any) => item.foodName === curr.foodName);
      if (!exists) acc.push(curr);
      return acc;
    }, [])
    .slice(0, 5) // ограничиваем результаты
    .map((entry: any) => ({
      source: 'personal' as const,
      personalFoodId: entry.id,
      name: entry.foodName,
      brand: entry.brand,
      caloriesPer100g: entry.calories / (entry.quantity / 100),
      proteinPer100g: entry.protein / (entry.quantity / 100),
      carbsPer100g: entry.carbohydrates / (entry.quantity / 100),
      fatPer100g: entry.fat / (entry.quantity / 100),
      defaultUnit: 'g' as const
    }));
  
  return filtered;
};

// Вспомогательная функция: преобразование ответа FatSecret в наш формат
export const mapFatSecretToFoodResult = (item: FatSecretFoodItem): FoodSearchResult => {
  const calories = parseFloat(item.calories || '0');
  const protein = parseFloat(item.protein || '0');
  const carbs = parseFloat(item.carbohydrate || '0');
  const fat = parseFloat(item.fat || '0');
  
  // FatSecret часто возвращает данные на порцию, нормализуем на 100г если возможно
  const servingSize = parseFloat(item.serving_size) || 100;
  const ratio = servingSize >= 50 ? 100 / servingSize : 1; // грубая нормализация
  
  return {
    source: 'fatsecret',
    fatSecretFoodId: item.food_id,
    name: item.name,
    brand: item.brand_name,
    caloriesPer100g: calories * ratio,
    proteinPer100g: protein * ratio,
    carbsPer100g: carbs * ratio,
    fatPer100g: fat * ratio,
    defaultUnit: 'g',
    servingInfo: item.serving_size ? `${item.serving_size}г` : undefined
  };
};