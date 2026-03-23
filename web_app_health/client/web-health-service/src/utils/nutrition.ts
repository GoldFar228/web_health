
export const calculateCalories = (protein: number, carbs: number, fat: number): number => {
  // Калорийность макронутриентов: белки=4, углеводы=4, жиры=9 ккал/г
  return Math.round(protein * 4 + carbs * 4 + fat * 9);
};

export const scaleNutrients = (
  baseNutrients: { protein: number; carbs: number; fat: number; calories?: number },
  baseAmount: number,
  targetAmount: number,
  unit: string = 'g'
) => {
  const ratio = targetAmount / baseAmount;
  
  return {
    protein: Math.round(baseNutrients.protein * ratio * 10) / 10,
    carbs: Math.round(baseNutrients.carbs * ratio * 10) / 10,
    fat: Math.round(baseNutrients.fat * ratio * 10) / 10,
    calories: baseNutrients.calories 
      ? Math.round(baseNutrients.calories * ratio)
      : undefined
  };
};