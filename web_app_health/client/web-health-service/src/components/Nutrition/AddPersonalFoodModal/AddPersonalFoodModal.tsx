// src/components/Nutrition/AddPersonalFoodModal/AddPersonalFoodModal.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPersonalFood } from '../../../services/nutritionApi';
import { COMMON_UNITS, type PersonalFood, type CreatePersonalFoodDto} from '../../../types/personalFood';
import './AddPersonalFoodModal.css';

interface AddPersonalFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (food: PersonalFood) => void;
  initialName?: string;
  initialBrand?: string;
}

export const AddPersonalFoodModal: React.FC<AddPersonalFoodModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = '',
  initialBrand = '',
}) => {
  const [formData, setFormData] = useState<CreatePersonalFoodDto>({
    name: initialName,
    brand: initialBrand,
    caloriesPerServing: 0,
    proteinPerServing: 0,
    carbsPerServing: 0,
    fatPerServing: 0,
    servingSize: 0,
    defaultUnit: 'g',
    autoCalculateCalories: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        name: initialName,
        brand: initialBrand,
      }));
      setError(null);
    }
  }, [isOpen, initialName, initialBrand]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (field: keyof CreatePersonalFoodDto, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNumberChange = (field: keyof CreatePersonalFoodDto) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value) || 0;
    handleChange(field, Math.max(0, value));
  };

  const calculateCaloriesFromMacros = () => {
    const { proteinPerServing, carbsPerServing, fatPerServing } = formData;
    return Math.round(proteinPerServing * 4 + carbsPerServing * 4 + fatPerServing * 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📤 Отправка формы:', formData);
    
    if (!formData.name.trim()) {
      setError('Название продукта обязательно');
      return;
    }
    if (formData.servingSize <= 0) {
      setError('Размер порции должен быть больше 0');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = formData.autoCalculateCalories
        ? { ...formData, caloriesPerServing: calculateCaloriesFromMacros() }
        : formData;

      console.log('🚀 Payload:', payload);

      const created = await createPersonalFood(payload);
      
      console.log('✅ Создано:', created);
      
      onSuccess(created);
      onClose();
    } catch (err: any) {
      console.error('❌ Ошибка создания продукта:', err);
      
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
        setError(err.response.data?.message || `Ошибка ${err.response.status}`);
      } else if (err.request) {
        setError('Сервер не отвечает. Проверьте подключение.');
      } else {
        setError(err.message || 'Неизвестная ошибка');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-food-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>➕ Добавить продукт в мою базу</h3>
          <button 
            type="button" 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {error && <div className="form-error">⚠️ {error}</div>}

          <div className="form-group">
            <label>
              Название продукта <span className="required">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Например: Протеиновый батончик"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Бренд (необязательно)</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              placeholder="Например: Bombbar"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Размер порции <span className="required">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.servingSize || ''}
                onChange={handleNumberChange('servingSize')}
                placeholder="Например: 40"
                required
              />
            </div>
            <div className="form-group">
              <label>Единица измерения</label>
              <select
                value={formData.defaultUnit}
                onChange={(e) => handleChange('defaultUnit', e.target.value as any)}
              >
                {COMMON_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="form-hint">
            💡 Введите КБЖУ <strong>на указанную порцию</strong>. 
            Например: батончик 40г → укажите КБЖУ именно на 40г.
          </p>

          <fieldset className="nutrition-fields">
            <legend>Пищевая ценность на порцию</legend>
            <div className="form-row">
              <div className="form-group">
                <label>Калории (ккал)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.caloriesPerServing || ''}
                  onChange={handleNumberChange('caloriesPerServing')}
                  disabled={formData.autoCalculateCalories}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Белки (г)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.proteinPerServing || ''}
                  onChange={handleNumberChange('proteinPerServing')}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Углеводы (г)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.carbsPerServing || ''}
                  onChange={handleNumberChange('carbsPerServing')}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Жиры (г)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fatPerServing || ''}
                  onChange={handleNumberChange('fatPerServing')}
                  placeholder="0"
                />
              </div>
            </div>
          </fieldset>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.autoCalculateCalories}
              onChange={(e) => handleChange('autoCalculateCalories', e.target.checked)}
            />
            <span>
              Автоматически рассчитать калории из Б/У/Ж 
              <small>(4 ккал/г белки и углеводы, 9 ккал/г жиры)</small>
            </span>
          </label>

          {formData.autoCalculateCalories && (
            <div className="calculated-calories">
              🔢 Рассчитанные калории: <strong>{calculateCaloriesFromMacros()} ккал</strong>
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? '💾 Сохранение...' : '💾 Сохранить продукт'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};