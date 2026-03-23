// src/utils/nutritionCalculator.ts

import type { FatSecretServing } from '../types/mealEntry';

/**
 * Парсит числовое значение из строки FatSecret
 */
const parseNum = (val: string | undefined | null): number => {
  if (!val) return 0;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

/**
 * Определяет тип единицы измерения на основе описания порции
 */
export const detectUnitType = (serving: FatSecretServing): 'g' | 'ml' | 'pcs' | 'cup' | 'tbsp' | 'tsp' | 'oz' => {
  const desc = serving.measurement_description.toLowerCase();
  const metricUnit = serving.metric_serving_unit.toLowerCase();

  if (metricUnit === 'ml' || desc.includes('ml') || desc.includes('milliliter')) return 'ml';
  if (metricUnit === 'g' || desc.includes('g') || desc.includes('gram')) return 'g';
  if (desc.includes('cup') || desc.includes('чашк')) return 'cup';
  if (desc.includes('tablespoon') || desc.includes('tbsp') || desc.includes('ст. ложк')) return 'tbsp';
  if (desc.includes('teaspoon') || desc.includes('tsp') || desc.includes('ч. ложк')) return 'tsp';
  if (desc.includes('oz') || desc.includes('ounce')) return 'oz';
  if (desc.includes('piece') || desc.includes('шт') || serving.number_of_units === '1.000') return 'pcs';
  
  return metricUnit as 'g' | 'ml' | 'pcs' | 'cup' | 'tbsp' | 'tsp' | 'oz' || 'g';
};

/**
 * Конвертирует единицы измерения в граммы (приблизительно)
 */
export const convertToGrams = (quantity: number, unit: string): number => {
  const conversions: Record<string, number> = {
    'g': 1,
    'ml': 1, // для воды, примерно
    'pcs': 100, // среднее значение, будет переопределено serving
    'cup': 240,
    'tbsp': 15,
    'tsp': 5,
    'oz': 28.35,
    'serving': 100
  };
  return quantity * (conversions[unit] || 100);
};

/**
 * Рассчитывает КБЖУ для выбранной порции и количества
 * @param serving - выбранная порция из FatSecret
 * @param quantity - количество единиц (например, 2 яблока)
 * @param unit - единица измерения
 */
export interface NutritionValues {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  servingDescription: string;
}

export const calculateNutrition = (
  serving: FatSecretServing,
  quantity: number = 1,
  unit?: string
): NutritionValues => {
  const baseCalories = parseNum(serving.calories);
  const baseProtein = parseNum(serving.protein);
  const baseCarbs = parseNum(serving.carbohydrate);
  const baseFat = parseNum(serving.fat);

  // Количество единиц в этой порции (обычно 1)
  const servingUnits = parseNum(serving.number_of_units) || 1;

  // Множитель: сколько раз базовая порция помещается в выбранное количество
  const multiplier = quantity / servingUnits;

  return {
    calories: Math.round(baseCalories * multiplier),
    protein: parseFloat((baseProtein * multiplier).toFixed(1)),
    carbohydrates: parseFloat((baseCarbs * multiplier).toFixed(1)),
    fat: parseFloat((baseFat * multiplier).toFixed(1)),
    servingDescription: serving.serving_description
  };
};

/**
 * Находит порцию по ID
 */
export const findServingById = (
  servings: FatSecretServing[],
  servingId: string
): FatSecretServing | undefined => {
  return servings.find(s => s.serving_id === servingId);
};

/**
 * Форматирует описание порции для отображения
 */
export const formatServingDescription = (serving: FatSecretServing): string => {
  const metricAmount = parseNum(serving.metric_serving_amount);
  const metricUnit = serving.metric_serving_unit;
  const description = serving.measurement_description;

  // Пример: "1 medium (2-3/4" dia)" → "1 шт. (138г)"
  return `${description} (${metricAmount}${metricUnit})`;
};

/**
 * Группирует порции по типу единицы измерения
 */
export const groupServingsByUnit = (servings: FatSecretServing[]): Record<string, FatSecretServing[]> => {
  return servings.reduce((acc, serving) => {
    const unitType = detectUnitType(serving);
    if (!acc[unitType]) {
      acc[unitType] = [];
    }
    acc[unitType].push(serving);
    return acc;
  }, {} as Record<string, FatSecretServing[]>);
};