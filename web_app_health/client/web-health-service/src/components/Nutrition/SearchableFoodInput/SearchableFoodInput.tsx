// src/components/Nutrition/SearchableFoodInput/SearchableFoodInput.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    searchFatSecretFoods,
    searchPersonalFoodHistory,
    mapFatSecretToFoodResult,
    getFatSecretFoodDetails,
    mapPersonalToFoodResult,
    type FoodSearchResult
} from '../../../services/nutritionApi';
import { AddPersonalFoodModal } from '../AddPersonalFoodModal/AddPersonalFoodModal';
import type { PersonalFood } from '../../../types/personalFood';
import './SearchableFoodInput.css';

interface SearchableFoodInputProps {
    onSelect: (food: FoodSearchResult) => void;
    onCreatePersonal?: (name: string, brand?: string) => void;
    initialValue?: string;
    minLength?: number;
    debounceMs?: number;
}

export const SearchableFoodInput: React.FC<SearchableFoodInputProps> = ({
    onSelect,
    onCreatePersonal,
    initialValue = '',
    minLength = 4,
    debounceMs = 300
}) => {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState<FoodSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [error, setError] = useState<string | null>(null);
    
    // Состояние для модального окна
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [pendingFoodName, setPendingFoodName] = useState('');
    const [pendingBrand, setPendingBrand] = useState<string | undefined>(undefined);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();
    const selectedResultRef = useRef<FoodSearchResult | null>(null);
    
    // Кэш для оптимистичного поиска
    const personalFoodCacheRef = useRef<Map<number, FoodSearchResult>>(new Map());

    const addToPersonalCache = useCallback((food: FoodSearchResult) => {
        if (food.personalFoodId) {
            personalFoodCacheRef.current.set(food.personalFoodId, food);
        }
    }, []);

    const searchInPersonalCache = useCallback((searchQuery: string): FoodSearchResult[] => {
        const lowerQuery = searchQuery.toLowerCase();
        return Array.from(personalFoodCacheRef.current.values()).filter(food => 
            food.name.toLowerCase().includes(lowerQuery) ||
            (food.brand?.toLowerCase().includes(lowerQuery))
        );
    }, []);

    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < minLength) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const fatSecretResults = await searchFatSecretFoods(searchQuery, 8);
            const mappedResults = fatSecretResults.map(mapFatSecretToFoodResult);

            // Поиск в личных продуктах
            let personalResults: FoodSearchResult[] = [];
            try {
                personalResults = await searchPersonalFoodHistory(searchQuery);
            } catch (err) {
                console.warn('⚠️ Не удалось загрузить личные продукты:', err);
            }
            
            // Добавляем из кэша
            const cachedResults = searchInPersonalCache(searchQuery);
            const cachedIds = new Set(cachedResults.map(r => r.personalFoodId));
            const uniquePersonal = [
                ...personalResults,
                ...cachedResults.filter(c => c.personalFoodId && !cachedIds.has(c.personalFoodId))
            ];

            // Объединяем результаты
            const combined = [
                ...mappedResults,
                ...uniquePersonal.filter(p =>
                    !mappedResults.some(m => m.name.toLowerCase() === p.name.toLowerCase())
                )
            ];
            
            setResults(combined.slice(0, 15));
            setIsOpen(true);
        } catch (err) {
            console.error('Search error:', err);
            setError('Не удалось загрузить результаты');
            
            const cachedResults = searchInPersonalCache(searchQuery);
            if (cachedResults.length > 0) {
                setResults(cachedResults);
                setIsOpen(true);
            } else {
                setResults([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [minLength, searchInPersonalCache]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (query.trim()) {
                performSearch(query.trim());
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, debounceMs);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, performSearch, debounceMs]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current && !inputRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && e.key === 'Enter' && query.trim().length >= minLength) {
            // 🔥 Enter без открытых результатов → открываем форму добавления
            e.preventDefault();
            handleCreatePersonal(query.trim());
            return;
        }
        
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(i => Math.min(i + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                if (highlightedIndex >= 0) {
                    e.preventDefault();
                    handleSelect(results[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleResultSelect = useCallback((food: FoodSearchResult) => {
        selectedResultRef.current = food;
        onSelect(food);
        setQuery(food.name);
        setIsOpen(false);
        setHighlightedIndex(-1);
    }, [onSelect]);

    useEffect(() => {
        selectedResultRef.current = null;
    }, [query]);

    const handleSelect = async (food: FoodSearchResult) => {
        // 🔥 ВАЖНО: устанавливаем ссылку ДО того, как может сработать onBlur
        selectedResultRef.current = food;
        
        if (food.source === 'fatsecret' && !food.isDetailsLoaded && food.fatSecretFoodId) {
            setIsLoadingDetails(true);
            try {
                const detailedFood = await getFatSecretFoodDetails(food.fatSecretFoodId);
                onSelect(detailedFood);
                setQuery(detailedFood.name);
            } catch (err) {
                console.error('Failed to load food details:', err);
                onSelect(food);
                setQuery(food.name);
            } finally {
                setIsLoadingDetails(false);
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        } else {
            onSelect(food);
            setQuery(food.name);
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    };

    // 🔥 Открытие модального окна
    const handleCreatePersonal = useCallback((name: string, brand?: string) => {
        setPendingFoodName(name);
        setPendingBrand(brand);
        setIsAddModalOpen(true);
    }, []);

    // 🔥 Обработка успешного создания
    const handlePersonalFoodCreated = useCallback((createdFood: PersonalFood) => {
        const newFood: FoodSearchResult = mapPersonalToFoodResult(createdFood);
        
        // Добавляем в кэш
        addToPersonalCache(newFood);
        
        // Передаём в родительский компонент
        onSelect(newFood);
        setQuery(createdFood.name);
        
        // Сброс
        setPendingFoodName('');
        setPendingBrand(undefined);
    }, [onSelect, addToPersonalCache]);

    return (
        <div className="searchable-food-input__wrapper" ref={dropdownRef}>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuery(value);
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => performSearch(value), debounceMs);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    setTimeout(() => {
                        setIsOpen(false);
                    }, 100);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Начните вводить название продукта..."
                autoComplete="off"
            />

            {(isLoading || isLoadingDetails) && (
                <div className="search-loading">
                    {isLoadingDetails ? '🔄 Загрузка данных...' : '🔍 Поиск...'}
                </div>
            )}

            {error && isOpen && (
                <div className="search-error">⚠️ {error}</div>
            )}

            {isOpen && results.length > 0 && (
                <ul className="food-search-results">
                    {/* 🔥 Кнопка "Добавить новый продукт" — всегда вверху списка */}
                    <li
                        className="food-result-item add-new-food-btn"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            handleCreatePersonal(query.trim());
                        }}
                    >
                        <div className="food-result-main">
                            <strong>➕ Добавить "{query.trim()}" в мою базу</strong>
                        </div>
                        <div className="food-source-badge">📚 Личный продукт</div>
                    </li>
                    
                    {/* Разделитель */}
                    <li className="search-results-divider">
                        <span>Найдено в базах:</span>
                    </li>
                    
                    {/* Результаты поиска */}
                    {results.map((food, index) => (
                        <li
                            key={`${food.source}-${food.personalFoodId || food.fatSecretFoodId}-${index}`}
                            className={`food-result-item ${index === highlightedIndex ? 'highlighted' : ''} ${!food.isDetailsLoaded && food.source === 'fatsecret' ? 'pending-data' : ''}`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(food);
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <div className="food-result-main">
                                <strong>{food.name}</strong>
                                {food.brand && <span className="food-brand">• {food.brand}</span>}
                                {food.servingInfo && <span className="food-serving">({food.servingInfo})</span>}
                                {!food.isDetailsLoaded && food.source === 'fatsecret' && (
                                    <span className="text-xs text-gray-400 ml-2">📥 КБЖУ при выборе</span>
                                )}
                            </div>

                            {food.isDetailsLoaded || food.source === 'personal' ? (
                                <div className="food-nutrition">
                                    {food.source === 'personal' ? (
                                        <>
                                            {food.servingSize && food.caloriesPerServing != null ? (
                                                <>
                                                    {Math.round(food.caloriesPerServing)} ккал |
                                                    Б: {(food.proteinPerServing ?? 0).toFixed(1)}г |
                                                    У: {(food.carbsPerServing ?? 0).toFixed(1)}г |
                                                    Ж: {(food.fatPerServing ?? 0).toFixed(1)}г
                                                    <span className="text-xs text-gray-400 ml-1">
                                                        на {food.servingSize} {food.servingUnit || 'г'}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    {Math.round(food.caloriesPer100g * (food.servingSize ?? 100) / 100)} ккал |
                                                    Б: {(food.proteinPer100g * (food.servingSize ?? 100) / 100).toFixed(1)}г |
                                                    У: {(food.carbsPer100g * (food.servingSize ?? 100) / 100).toFixed(1)}г |
                                                    Ж: {(food.fatPer100g * (food.servingSize ?? 100) / 100).toFixed(1)}г
                                                    <span className="text-xs text-gray-400 ml-1">
                                                        на {food.servingSize ?? 100} {food.defaultUnit}
                                                    </span>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {food.caloriesPer100g.toFixed(0)} ккал |
                                            Б: {food.proteinPer100g.toFixed(1)}г |
                                            У: {food.carbsPer100g.toFixed(1)}г |
                                            Ж: {food.fatPer100g.toFixed(1)}г
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="food-nutrition text-gray-400 text-sm">
                                    КБЖУ загрузится после выбора
                                </div>
                            )}

                            <div className="food-source-badge">
                                {food.source === 'personal' ? '📚 Мой продукт' : '🌐 FatSecret'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* 🔥 Если результатов нет — показываем только кнопку добавления */}
            {isOpen && query.length >= minLength && results.length === 0 && !isLoading && !isLoadingDetails && (
                <div className="search-empty">
                    <p>Продукт "{query}" не найден в базе</p>
                    {onCreatePersonal && (
                        <button
                            type="button"
                            className="btn-create-personal"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleCreatePersonal(query.trim());
                            }}
                        >
                            ➕ Добавить "{query}" в мою базу
                        </button>
                    )}
                </div>
            )}

            {/* Модальное окно */}
            {isAddModalOpen && (
                <AddPersonalFoodModal
                    isOpen={isAddModalOpen}
                    onClose={() => {
                        setIsAddModalOpen(false);
                        setPendingFoodName('');
                        setPendingBrand(undefined);
                    }}
                    onSuccess={handlePersonalFoodCreated}
                    initialName={pendingFoodName}
                    initialBrand={pendingBrand}
                />
            )}
        </div>
    );
};

export type { FoodSearchResult };