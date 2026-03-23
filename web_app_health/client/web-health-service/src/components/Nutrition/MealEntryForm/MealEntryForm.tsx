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
        entryTime: new Date().toTimeString().split(' ')[0].slice(0, 5),
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

    const [isNutritionManual, setIsNutritionManual] = useState(false);
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

    const calculateNutritionForQuantity = useCallback((food: FoodSearchResult, quantity: number, unit: string) => {
        const isGrams = unit === 'g';
        const baseQuantity = isGrams ? quantity : 100;
        const ratio = baseQuantity / 100;

        return {
            calories: Math.round(food.caloriesPer100g * ratio),
            protein: parseFloat((food.proteinPer100g * ratio).toFixed(1)),
            carbohydrates: parseFloat((food.carbsPer100g * ratio).toFixed(1)),
            fat: parseFloat((food.fatPer100g * ratio).toFixed(1))
        };
    }, []);

    // 🔥 ОБНОВЛЁННЫЙ ОБРАБОТЧИК: принимает FoodSearchResult с реальными КБЖУ
    const handleFoodSelect = useCallback((food: FoodSearchResult) => {
        setSelectedFood(food);

        setFormData(prev => {
            const nutrition = calculateNutritionForQuantity(food, prev.quantity, prev.unit);

            return {
                ...prev,
                foodName: food.name,
                brand: food.brand || '',
                fatSecretFoodId: food.source === 'fatsecret' ? food.fatSecretFoodId : undefined,

                // 🔥 Обновляем КБЖУ только если пользователь НЕ редактировал их вручную
                calories: isNutritionManual ? prev.calories : nutrition.calories,
                protein: isNutritionManual ? prev.protein : nutrition.protein,
                carbohydrates: isNutritionManual ? prev.carbohydrates : nutrition.carbohydrates,
                fat: isNutritionManual ? prev.fat : nutrition.fat
            };
        });
    }, [calculateNutritionForQuantity, isNutritionManual]); // ← добавь

    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = value === '' ? undefined : parseFloat(value);

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };

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

    const handleNutritionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = value === '' ? undefined : parseFloat(value);

        setFormData(prev => ({ ...prev, [name]: newValue }));

        // 🔥 Если пользователь меняет КБЖУ вручную — включаем флаг фиксации
        setIsNutritionManual(true);

        // Снимаем привязку к продукту (опционально, можно оставить)
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
                        {!selectedFood.isDetailsLoaded && selectedFood.source === 'fatsecret' && (
                            <span className="text-xs text-orange-500 ml-2">⏳ КБЖУ загружаются...</span>
                        )}
                    </span>
                )}
            </div>

            {error && <div className="error-message" role="alert">⚠️ {error}</div>}

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

            <div className="form-group">
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
                    }}
                    initialValue={formData.foodName}
                    minLength={4}
                    debounceMs={300}
                />
                <small className="form-hint">
                    Начните вводить название (от 4 символов) — появятся подсказки из базы и вашей истории
                </small>
            </div>

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

            <fieldset className="nutrition-fields">
                <div className="nutrition-legend-wrapper">
                    <span>📊 Пищевая ценность</span>
                    {isNutritionManual && (
                        <span className="nutrition-manual-badge">
                            ✏️ Ручной режим
                        </span>
                    )}
                </div>

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
            {isNutritionManual && (
                <button
                    type="button"
                    onClick={() => {
                        setIsNutritionManual(false);
                        if (selectedFood) {
                            const nutrition = calculateNutritionForQuantity(selectedFood, formData.quantity, formData.unit);
                            setFormData(prev => ({
                                ...prev,
                                calories: nutrition.calories,
                                protein: nutrition.protein,
                                carbohydrates: nutrition.carbohydrates,
                                fat: nutrition.fat
                            }));
                        }
                    }}
                    className="nutrition-reset-btn"
                >
                    ↺ Вернуть авто-расчёт
                </button>
            )}
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