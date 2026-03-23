// src/components/Meals/MealEntryForm/MealEntryForm.tsx
import React, { useState, useCallback } from 'react';
import type { CreateMealEntryDto } from '../../../types/mealEntry';
import { foodLogApi } from '../../../services/foodLogApi';
import { 
  SearchableFoodInput, 
  type FoodSearchResult 
} from '../SearchableFoodInput/SearchableFoodInput';
import './MealEntryForm.css';

interface MealEntryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialDate?: string;
}

export const MealEntryForm: React.FC<MealEntryFormProps> = ({
  onSuccess,
  onCancel,
  initialDate
}) => {
  const [formData, setFormData] = useState<CreateMealEntryDto>({
    entryDate: initialDate || new Date().toISOString().split('T')[0],
    entryTime: new Date().toTimeString().split(' ')[0].slice(0, 5), // HH:MM
    mealType: 'breakfast',
    foodName: '',
    brand: '',
    quantity: 100,
    unit: 'g',
    calories: undefined,
    protein: undefined,
    carbohydrates: undefined,
    fat: undefined,
    notes: '',
    fatSecretFoodId: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value
    }));
  };

  // 🔥 Ключевая функция: расчёт КБЖУ на основе выбранного количества
  const calculateNutritionForQuantity = useCallback((food: FoodSearchResult, quantity: number, unit: string) => {
    // Базовый множитель: если единица не граммы, можно добавить конвертацию позже
    const isGrams = unit === 'g';
    const baseQuantity = isGrams ? quantity : 100; // пока считаем на 100г для не-граммов
    
    const ratio = baseQuantity / 100;
    
    return {
      calories: Math.round(food.caloriesPer100g * ratio),
      protein: parseFloat((food.proteinPer100g * ratio).toFixed(1)),
      carbohydrates: parseFloat((food.carbsPer100g * ratio).toFixed(1)),
      fat: parseFloat((food.fatPer100g * ratio).toFixed(1))
    };
  }, []);

  // 🔥 Обработчик выбора продукта из поисковой подсказки
  const handleFoodSelect = useCallback((food: FoodSearchResult) => {
    setSelectedFood(food);
    
    // Автозаполнение полей формы
    setFormData(prev => {
      const nutrition = calculateNutritionForQuantity(food, prev.quantity, prev.unit);
      
      return {
        ...prev,
        foodName: food.name,
        brand: food.brand || '',
        fatSecretFoodId: food.source === 'fatsecret' ? food.fatSecretFoodId : undefined,
        // Если пользователь ещё не менял КБЖУ вручную — заполняем
        calories: prev.calories ?? nutrition.calories,
        protein: prev.protein ?? nutrition.protein,
        carbohydrates: prev.carbohydrates ?? nutrition.carbohydrates,
        fat: prev.fat ?? nutrition.fat
      };
    });
  }, [calculateNutritionForQuantity]);

  // 🔥 Пересчёт КБЖУ при изменении количества/единицы, если продукт выбран
  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Если есть выбранный продукт и меняем количество/единицу — пересчитываем КБЖУ
      if (selectedFood && (name === 'quantity' || name === 'unit')) {
        const quantity = name === 'quantity' ? (newValue ?? 100) : prev.quantity;
        const unit = name === 'unit' ? (value as string) : prev.unit;
        const nutrition = calculateNutritionForQuantity(selectedFood, quantity, unit);
        
        return {
          ...updated,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbohydrates: nutrition.carbohydrates,
          fat: nutrition.fat
        };
      }
      
      return updated;
    });
  }, [selectedFood, calculateNutritionForQuantity]);

  // 🔥 Если пользователь начинает редактировать КБЖУ вручную — отвязываем от авто-расчёта
  const handleNutritionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === '' ? undefined : parseFloat(value);
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Если пользователь меняет КБЖУ вручную — снимаем привязку к выбранному продукту
    // (но не очищаем fatSecretFoodId, чтобы бэкенд мог подтянуть данные при необходимости)
    if (selectedFood) {
      setSelectedFood(null);
    }
  }, [selectedFood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Подготовка данных: если есть fatSecretFoodId — отправляем его, 
      // бэкенд сам подтянет КБЖУ, если они не заполнены
      const submitData: CreateMealEntryDto = {
        ...formData,
        // Если пользователь вручную не заполнил КБЖУ, но есть ID из FatSecret — 
        // можно отправить нули или undefined, сервис сам заполнит
        ...(formData.fatSecretFoodId && !formData.calories ? {
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0
        } : {})
      };

      await foodLogApi.addEntry(submitData);
      onSuccess();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Не удалось добавить запись');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="meal-entry-form">
      <div className="form-header">
        <h3>➕ Добавить приём пищи</h3>
        {selectedFood && (
          <span className="selected-badge">
            ✅ {selectedFood.name} {selectedFood.brand ? `• ${selectedFood.brand}` : ''}
          </span>
        )}
      </div>

      {error && <div className="error-message" role="alert">⚠️ {error}</div>}

      {/* Дата и время */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="entryDate">📅 Дата</label>
          <input
            type="date"
            id="entryDate"
            name="entryDate"
            value={formData.entryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="entryTime">🕐 Время</label>
          <input
            type="time"
            id="entryTime"
            name="entryTime"
            value={formData.entryTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Тип приёма пищи */}
      <div className="form-group">
        <label htmlFor="mealType">🍽️ Тип приёма пищи</label>
        <select
          id="mealType"
          name="mealType"
          value={formData.mealType}
          onChange={handleChange}
          required
        >
          <option value="breakfast">🌅 Завтрак</option>
          <option value="lunch">☀️ Обед</option>
          <option value="dinner">🌙 Ужин</option>
          <option value="snack">🍎 Перекус</option>
          <option value="other">📝 Другое</option>
        </select>
      </div>

      {/* 🔥 Поиск продукта с автодополнением */}
      <div className="form-group">
        <label>🔍 Продукт</label>
        <SearchableFoodInput
          onSelect={handleFoodSelect}
          onCreatePersonal={(name, brand) => {
            // Если пользователь хочет добавить продукт вручную
            setFormData(prev => ({
              ...prev,
              foodName: name,
              brand: brand || ''
            }));
            setSelectedFood(null);
          }}
          initialValue={formData.foodName}
          minLength={4}
          debounceMs={300}
        />
        <small className="form-hint">
          Начните вводить название (от 4 символов) — появятся подсказки из базы и вашей истории
        </small>
      </div>

      {/* Количество и единицы */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">⚖️ Количество</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            min="0.1"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Единица</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleQuantityChange}
          >
            <option value="g">грамм (г)</option>
            <option value="ml">миллилитр (мл)</option>
            <option value="pcs">штука (шт)</option>
            <option value="cup">стакан</option>
            <option value="tbsp">ст. ложка</option>
            <option value="tsp">ч. ложка</option>
          </select>
        </div>
      </div>

      {/* 🔥 КБЖУ — с авто-расчётом или ручным вводом */}
      <fieldset className="nutrition-fields">
        <legend>
          📊 Пищевая ценность 
          {selectedFood && <span className="auto-calculated"> (авто-расчёт на {formData.quantity}{formData.unit})</span>}
        </legend>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="calories">🔥 Калории (ккал)</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories ?? ''}
              onChange={handleNutritionChange}
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="protein">🥩 Белки (г)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein ?? ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="carbohydrates">🍞 Углеводы (г)</label>
            <input
              type="number"
              id="carbohydrates"
              name="carbohydrates"
              value={formData.carbohydrates ?? ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
              placeholder="0.0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fat">🥑 Жиры (г)</label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat ?? ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
              placeholder="0.0"
            />
          </div>
        </div>
      </fieldset>

      {/* Заметки */}
      <div className="form-group">
        <label htmlFor="notes">📝 Заметки (опционально)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Например: без соли, приготовлено на гриле..."
        />
      </div>

      {/* Кнопки */}
      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary"
          disabled={isLoading}
        >
          Отмена
        </button>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading || !formData.foodName}
        >
          {isLoading ? '⏳ Сохранение...' : '✅ Добавить'}
        </button>
      </div>
    </form>
  );
};