import React, { useState, useEffect, useRef } from 'react';
import './SearchableFoodInput.css'
export interface FoodSearchResult {
  source: 'fatsecret' | 'personal';
  fatSecretFoodId?: string;
  personalFoodId?: number;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultUnit: 'g' | 'ml' | 'pcs';
}

interface SearchableFoodInputProps {
  onSelect: (food: FoodSearchResult) => void;
  onCreatePersonal: (name: string, brand?: string) => void;
  initialValue?: string;
}

const API_BASE = '/api/PersonalFoods';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const SearchableFoodInput: React.FC<SearchableFoodInputProps> = ({
  onSelect,
  onCreatePersonal,
  initialValue = ''
}) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Поиск с дебаунсом (300мс после последнего ввода)
  useEffect(() => {
    if (query.length < 6) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/search?query=${encodeURIComponent(query)}`,
          { headers: getAuthHeaders() }
        );
        
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Навигация клавишами
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (food: FoodSearchResult) => {
    onSelect(food);
    setQuery(food.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleCreatePersonal = () => {
    onCreatePersonal(query);
    setIsOpen(false);
  };

  return (
    <div className="searchable-food-input" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 6 && setIsOpen(true)}
        placeholder="Начните вводить название продукта..."
        className="food-search-input"
      />
      
      {isLoading && <div className="search-loading">🔍 Поиск...</div>}
      
      {isOpen && results.length > 0 && (
        <ul className="food-search-results">
          {results.map((food, index) => (
            <li
              key={`${food.source}-${food.personalFoodId || food.fatSecretFoodId}`}
              className={`food-result-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onClick={() => handleSelect(food)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="food-name">
                {food.name}
                {food.brand && <span className="food-brand"> • {food.brand}</span>}
              </div>
              <div className="food-nutrition-mini">
                {food.caloriesPer100g} ккал | 
                Б: {food.proteinPer100g}г | 
                У: {food.carbsPer100g}г | 
                Ж: {food.fatPer100g}г
              </div>
              <span className={`food-source-badge ${food.source}`}>
                {food.source === 'personal' ? '📚 Моя база' : '🌐 FatSecret'}
              </span>
            </li>
          ))}
        </ul>
      )}
      
      {isOpen && query.length >= 6 && results.length === 0 && !isLoading && (
        <div className="food-search-empty">
          <p>Продукт "{query}" не найден</p>
          <button 
            type="button" 
            className="btn-create-personal"
            onClick={handleCreatePersonal}
          >
            ➕ Добавить в мою базу
          </button>
        </div>
      )}
    </div>
  );
};