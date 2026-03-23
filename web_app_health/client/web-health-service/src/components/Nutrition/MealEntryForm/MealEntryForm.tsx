// src/components/Nutrition/MealEntryForm/MealEntryForm.tsx

import React, { useState, useCallback, useEffect } from 'react';
import type { CreateMealEntryDto, FatSecretServing } from '../../../types/mealEntry';
import { foodLogApi } from '../../../services/foodLogApi';
import { getFatSecretFoodDetails } from '../../../services/nutritionApi';
import {
  SearchableFoodInput,
  type FoodSearchResult
} from '../SearchableFoodInput/SearchableFoodInput';
import { ServingSelector } from '../ServingSelector/ServingSelector';
import {
  calculateNutrition,
  findServingById,
  detectUnitType
} from '../../../utils/nutritionCalculator';
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
    entryTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
    mealType: 'breakfast',
    foodName: '',
    brand: '',
    quantity: 1,
    unit: 'pcs',
    calories: undefined,
    protein: undefined,
    carbohydrates: undefined,
    fat: undefined,
    notes: '',
    fatSecretFoodId: undefined,
    fatSecretServingId: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);
  const [selectedServing, setSelectedServing] = useState<FatSecretServing | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 🔥 Загрузка деталей продукта при выборе
  useEffect(() => {
    const loadFoodDetails = async () => {
      if (!selectedFood?.fatSecretFoodId || selectedFood.isDetailsLoaded) return;

      setIsCalculating(true);
      try {
        const details = await getFatSecretFoodDetails(selectedFood.fatSecretFoodId);
        
        setSelectedFood({
          ...details,
          fatSecretFoodId: selectedFood.fatSecretFoodId
        });

        // Автовыбор первой порции
        if (details.servings && details.servings.length > 0) {
          handleServingSelect(details.servings[0]);
        }
      } catch (err) {
        console.error('Failed to load food details:', err);
      } finally {
        setIsCalculating(false);
      }
    };

    loadFoodDetails();
  }, [selectedFood?.fatSecretFoodId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value
    }));
  };

  // 🔥 Обработчик выбора порции
  const handleServingSelect = useCallback((serving: FatSecretServing) => {
    setSelectedServing(serving);
    
    const unitType = detectUnitType(serving);
    const quantity = parseFloat(serving.number_of_units) || 1;
    
    const nutrition = calculateNutrition(serving, quantity, unitType);

    setFormData(prev => ({
      ...prev,
      unit: unitType,
      quantity: quantity,
      fatSecretServingId: serving.serving_id,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbohydrates: nutrition.carbohydrates,
      fat: nutrition.fat
    }));
  }, []);

  // 🔥 Обработчик выбора продукта
  const handleFoodSelect = useCallback((food: FoodSearchResult) => {
    setSelectedFood(food);
    setSelectedServing(null);

    setFormData(prev => ({
      ...prev,
      foodName: food.name,
      brand: food.brand || '',
      fatSecretFoodId: food.source === 'fatsecret' ? food.fatSecretFoodId : undefined,
      fatSecretServingId: undefined,
      // Сбрасываем КБЖУ - будут загружены с деталями продукта
      calories: undefined,
      protein: undefined,
      carbohydrates: undefined,
      fat: undefined
    }));
  }, []);

  // 🔥 Пересчёт при изменении количества
  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newQuantity = value === '' ? 0 : parseFloat(value);

    setFormData(prev => ({
      ...prev,
      quantity: newQuantity
    }));

    // Пересчитываем если есть выбранная порция
    if (selectedServing && newQuantity > 0) {
      const nutrition = calculateNutrition(selectedServing, newQuantity, formData.unit);
      
      setFormData(prev => ({
        ...prev,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbohydrates: nutrition.carbohydrates,
        fat: nutrition.fat
      }));
    }
  }, [selectedServing, formData.unit]);

  // 🔥 Ручное изменение КБЖУ отвязывает от авто-расчёта
  const handleNutritionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = value === '' ? undefined : parseFloat(value);

    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Снимаем привязку к продукту
    if (selectedFood) {
      setSelectedFood(null);
    }
  }, [selectedFood]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submitData: CreateMealEntryDto = {
        ...formData,
        // Если КБЖУ не заполнены, но есть fatSecretFoodId - отправляем 0
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
    <form className="meal-entry-form" onSubmit={handleSubmit}>
      <div className="meal-entry-form__header">
        <h2>➕ Добавить приём пищи</h2>
        <button
          type="button"
          className="meal-entry-form__close"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>

      {selectedFood && (
        <div className="meal-entry-form__selected-food">
          ✅ {selectedFood.name} {selectedFood.brand ? `• ${selectedFood.brand}` : ''}
          {isCalculating && <span className="meal-entry-form__loading">Загрузка...</span>}
        </div>
      )}

      {error && (
        <div className="meal-entry-form__error">
          ⚠️ {error}
        </div>
      )}

      {/* Дата и время */}
      <div className="meal-entry-form__row">
        <div className="meal-entry-form__field">
          <label>📅 Дата</label>
          <input
            type="date"
            name="entryDate"
            value={formData.entryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="meal-entry-form__field">
          <label>🕐 Время</label>
          <input
            type="time"
            name="entryTime"
            value={formData.entryTime}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Тип приёма пищи */}
      <div className="meal-entry-form__field">
        <label>🍽️ Тип приёма пищи</label>
        <select
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

      {/* Поиск продукта */}
      <div className="meal-entry-form__field">
        <label>🔍 Продукт</label>
        <SearchableFoodInput
          onSelect={handleFoodSelect}
          onCreatePersonal={(name, brand) => {
            setFormData(prev => ({
              ...prev,
              foodName: name,
              brand: brand || ''
            }));
            setSelectedFood(null);
            setSelectedServing(null);
          }}
          initialValue={formData.foodName}
        />
        <small className="meal-entry-form__hint">
          Начните вводить название (от 4 символов) — появятся подсказки
        </small>
      </div>

      {/* 🔥 Выбор порции (если есть данные из FatSecret) */}
      {selectedFood?.servings && selectedFood.servings.length > 0 && (
        <ServingSelector
          servings={selectedFood.servings}
          selectedServingId={formData.fatSecretServingId || null}
          onSelectServing={handleServingSelect}
        />
      )}

      {/* Количество и единицы */}
      <div className="meal-entry-form__row">
        <div className="meal-entry-form__field">
          <label>⚖️ Количество</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleQuantityChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="meal-entry-form__field">
          <label>Единица</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          >
            <option value="g">грамм (г)</option>
            <option value="ml">миллилитр (мл)</option>
            <option value="pcs">штука (шт)</option>
            <option value="cup">стакан</option>
            <option value="tbsp">ст. ложка</option>
            <option value="tsp">ч. ложка</option>
            <option value="oz">унция (oz)</option>
            <option value="serving">порция</option>
          </select>
        </div>
      </div>

      {/* КБЖУ */}
      <div className="meal-entry-form__section">
        <h3>
          📊 Пищевая ценность
          {selectedFood && (
            <span className="meal-entry-form__auto-calc">
              (авто-расчёт на {formData.quantity} {formData.unit})
            </span>
          )}
        </h3>

        <div className="meal-entry-form__row">
          <div className="meal-entry-form__field">
            <label>🔥 Калории (ккал)</label>
            <input
              type="number"
              name="calories"
              value={formData.calories || ''}
              onChange={handleNutritionChange}
              min="0"
              step="1"
            />
          </div>

          <div className="meal-entry-form__field">
            <label>🥩 Белки (г)</label>
            <input
              type="number"
              name="protein"
              value={formData.protein || ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>

        <div className="meal-entry-form__row">
          <div className="meal-entry-form__field">
            <label>🍞 Углеводы (г)</label>
            <input
              type="number"
              name="carbohydrates"
              value={formData.carbohydrates || ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
            />
          </div>

          <div className="meal-entry-form__field">
            <label>🥑 Жиры (г)</label>
            <input
              type="number"
              name="fat"
              value={formData.fat || ''}
              onChange={handleNutritionChange}
              min="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Заметки */}
      <div className="meal-entry-form__field">
        <label>📝 Заметки (опционально)</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Дополнительная информация..."
        />
      </div>

      {/* Кнопки */}
      <div className="meal-entry-form__actions">
        <button
          type="button"
          className="meal-entry-form__btn meal-entry-form__btn--cancel"
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="meal-entry-form__btn meal-entry-form__btn--submit"
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : '💾 Сохранить'}
        </button>
      </div>
    </form>
  );
};