// src/components/Nutrition/SearchableFoodInput/SearchableFoodInput.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    searchFatSecretFoods,
    searchPersonalFoodHistory,
    mapFatSecretToFoodResult,
    getFatSecretFoodDetails,
    type FoodSearchResult
} from '../../../services/nutritionApi';
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
    const [isLoadingDetails, setIsLoadingDetails] = useState(false); // 🔥 Новый стейт
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [error, setError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

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

            if (mappedResults.length < 5) {
                const personalResults = await searchPersonalFoodHistory(searchQuery);
                const combined = [
                    ...mappedResults,
                    ...personalResults.filter(p =>
                        !mappedResults.some(m => m.name.toLowerCase() === p.name.toLowerCase())
                    )
                ];
                setResults(combined.slice(0, 10));
            } else {
                setResults(mappedResults);
            }

            setIsOpen(true);
        } catch (err) {
            console.error('Search error:', err);
            setError('Не удалось загрузить результаты');

            try {
                const personalResults = await searchPersonalFoodHistory(searchQuery);
                setResults(personalResults);
                setIsOpen(personalResults.length > 0);
            } catch {
                setResults([]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [minLength]);

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

    // 🔥 ОБНОВЛЁННЫЙ ОБРАБОТЧИК: ленивая загрузка деталей при клике
    const handleSelect = async (food: FoodSearchResult) => {
        // Если это продукт из FatSecret и данные ещё не загружены — запрашиваем детали
        if (food.source === 'fatsecret' && !food.isDetailsLoaded && food.fatSecretFoodId) {
            setIsLoadingDetails(true);

            try {
                console.log('🔍 Загрузка деталей для:', food.fatSecretFoodId);
                const detailedFood = await getFatSecretFoodDetails(food.fatSecretFoodId);
                console.log('✅ Получено:', detailedFood); // ← смотри консоль
                onSelect(detailedFood);
                setQuery(detailedFood.name);
            } catch (err) {
                console.error('Failed to load food details:', err);
                // Fallback: передаём исходные данные с нулями, чтобы не ломать поток
                onSelect(food);
                setQuery(food.name);
            } finally {
                setIsLoadingDetails(false);
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        } else {
            // Для личных продуктов или уже загруженных данных — сразу передаём
            onSelect(food);
            setQuery(food.name);
            setIsOpen(false);
            setHighlightedIndex(-1);
        }
    };

    const handleCreatePersonal = () => {
        onCreatePersonal?.(query);
        setIsOpen(false);
    };

    return (
        <div className="searchable-food-input__wrapper" ref={dropdownRef}>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => query.length >= minLength && setIsOpen(true)}
                placeholder="Начните вводить продукт (рис, курица...)..."
                className="food-search-input"
                autoComplete="off"
                disabled={isLoadingDetails} // Блокируем ввод пока грузятся детали
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
                    {results.map((food, index) => (
                        <li
                            key={`${food.source}-${food.fatSecretFoodId || food.personalFoodId}-${index}`}
                            className={`food-result-item ${index === highlightedIndex ? 'highlighted' : ''} ${!food.isDetailsLoaded && food.source === 'fatsecret' ? 'pending-data' : ''}`}
                            onClick={() => handleSelect(food)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <div className="food-result-main">
                                <strong>{food.name}</strong>
                                {food.brand && <span className="food-brand">• {food.brand}</span>}
                                {food.servingInfo && <span className="food-serving">({food.servingInfo})</span>}
                                {/* Индикатор, что данные подгрузятся при клике */}
                                {!food.isDetailsLoaded && food.source === 'fatsecret' && (
                                    <span className="text-xs text-gray-400 ml-2">📥 КБЖУ при выборе</span>
                                )}
                            </div>

                            {/* Показываем КБЖУ только если данные загружены */}
                            {food.isDetailsLoaded ? (
                                <div className="food-nutrition">
                                    {food.caloriesPer100g.toFixed(0)} ккал |
                                    Б: {food.proteinPer100g.toFixed(1)}г |
                                    У: {food.carbsPer100g.toFixed(1)}г |
                                    Ж: {food.fatPer100g.toFixed(1)}г
                                </div>
                            ) : food.source === 'personal' ? (
                                <div className="food-nutrition">
                                    {food.caloriesPer100g.toFixed(0)} ккал |
                                    Б: {food.proteinPer100g.toFixed(1)}г |
                                    У: {food.carbsPer100g.toFixed(1)}г |
                                    Ж: {food.fatPer100g.toFixed(1)}г
                                </div>
                            ) : (
                                <div className="food-nutrition text-gray-400 text-sm">
                                    КБЖУ загрузится после выбора
                                </div>
                            )}

                            <div className="food-source-badge">
                                {food.source === 'personal' ? '📚 История' : '🌐 FatSecret'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.length >= minLength && results.length === 0 && !isLoading && !isLoadingDetails && (
                <div className="search-empty">
                    <p>Продукт "{query}" не найден в базе</p>
                    {onCreatePersonal && (
                        <button
                            type="button"
                            className="btn-create-personal"
                            onClick={handleCreatePersonal}
                        >
                            ➕ Добавить "{query}" в мою базу
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};