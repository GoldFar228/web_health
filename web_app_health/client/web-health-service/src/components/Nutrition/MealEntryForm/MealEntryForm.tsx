import React, { useState } from 'react';
import type { CreateMealEntryDto } from '../../../types/mealEntry';
import { foodLogApi } from '../../../services/foodLogApi';

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
    entryTime: new Date().toTimeString().split(' ')[0],
    mealType: 'breakfast',
    foodName: '',
    brand: '',
    quantity: 100,
    unit: 'g',
    calories: undefined,
    protein: undefined,
    carbohydrates: undefined,
    fat: undefined,
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFatSecret, setUseFatSecret] = useState(false);
  const [fatSecretFoodId, setFatSecretFoodId] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const submitData: CreateMealEntryDto = {
        ...formData,
        ...(useFatSecret ? { fatSecretFoodId, calories: 0, protein: 0, carbohydrates: 0, fat: 0 } : {})
      };

      await foodLogApi.addEntry(submitData);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="meal-entry-form">
      <h3>Добавить приём пищи</h3>

      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="entryDate">Дата</label>
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
          <label htmlFor="entryTime">Время</label>
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

      <div className="form-group">
        <label htmlFor="mealType">Тип приёма пищи</label>
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

      <div className="form-group">
        <label htmlFor="foodName">Название продукта</label>
        <input
          type="text"
          id="foodName"
          name="foodName"
          value={formData.foodName}
          onChange={handleChange}
          placeholder="Например: Овсянка на воде"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="brand">Бренд (опционально)</label>
        <input
          type="text"
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Например: Мистраль"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Количество</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
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
            onChange={handleChange}
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

      {/* Опционально: интеграция с FatSecret */}
      <div className="form-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={useFatSecret}
            onChange={(e) => setUseFatSecret(e.target.checked)}
          />
          Использовать FatSecret API (авто-заполнение КБЖУ)
        </label>
      </div>

      {useFatSecret && (
        <div className="form-group">
          <label htmlFor="fatSecretFoodId">FatSecret Food ID</label>
          <input
            type="text"
            id="fatSecretFoodId"
            value={fatSecretFoodId}
            onChange={(e) => setFatSecretFoodId(e.target.value)}
            placeholder="Введите ID продукта из FatSecret"
          />
        </div>
      )}

      {/* Поля КБЖУ (можно заполнить вручную или через FatSecret) */}
      <div className="nutrition-fields">
        <h4>Пищевая ценность (на порцию)</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="calories">Калории (ккал)</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories || ''}
              onChange={handleChange}
              min="0"
              disabled={useFatSecret}
            />
          </div>

          <div className="form-group">
            <label htmlFor="protein">Белки (г)</label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              disabled={useFatSecret}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="carbohydrates">Углеводы (г)</label>
            <input
              type="number"
              id="carbohydrates"
              name="carbohydrates"
              value={formData.carbohydrates || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              disabled={useFatSecret}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fat">Жиры (г)</label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat || ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              disabled={useFatSecret}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Заметки (опционально)</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Любые дополнительные заметки..."
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Отмена
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Добавить'}
        </button>
      </div>
    </form>
  );
};