// src/components/Nutrition/ServingSelector/ServingSelector.tsx

import React from 'react';
import type { FatSecretServing } from '../../../types/mealEntry';
import { formatServingDescription, detectUnitType } from '../../../utils/nutritionCalculator';
import './ServingSelector.css';

interface ServingSelectorProps {
  servings: FatSecretServing[];
  selectedServingId: string | null;
  onSelectServing: (serving: FatSecretServing) => void;
}

export const ServingSelector: React.FC<ServingSelectorProps> = ({
  servings,
  selectedServingId,
  onSelectServing
}) => {
  if (!servings || servings.length === 0) {
    return null;
  }

  // Группируем порции по типу единицы
  const servingsByUnit = servings.reduce((acc, serving) => {
    const unitType = detectUnitType(serving);
    if (!acc[unitType]) {
      acc[unitType] = [];
    }
    acc[unitType].push(serving);
    return acc;
  }, {} as Record<string, FatSecretServing[]>);

  const unitLabels: Record<string, string> = {
    'g': 'Вес (граммы)',
    'ml': 'Объём (миллилитры)',
    'pcs': 'Штуки',
    'cup': 'Чашки',
    'tbsp': 'Столовые ложки',
    'tsp': 'Чайные ложки',
    'oz': 'Унции'
  };

  return (
    <div className="serving-selector">
      <label className="serving-selector__label">
        📏 Единица измерения
      </label>
      
      {Object.entries(servingsByUnit).map(([unitType, unitServings]) => (
        <div key={unitType} className="serving-selector__group">
          <h4 className="serving-selector__group-title">
            {unitLabels[unitType] || unitType}
          </h4>
          
          <div className="serving-selector__options">
            {unitServings.map((serving) => (
              <button
                key={serving.serving_id}
                type="button"
                className={`serving-selector__option ${
                  selectedServingId === serving.serving_id ? 'serving-selector__option--selected' : ''
                }`}
                onClick={() => onSelectServing(serving)}
              >
                <span className="serving-selector__description">
                  {formatServingDescription(serving)}
                </span>
                <span className="serving-selector__nutrition">
                  🔥 {serving.calories} ккал | 
                  Б: {serving.protein}г | 
                  У: {serving.carbohydrate}г | 
                  Ж: {serving.fat}г
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};