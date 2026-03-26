// /src/components/Workout/ExerciseSelector.tsx

import React, { useState } from 'react';
import { workoutApi } from '../../../services/workoutApi';
import type { Exercise, WgerExercise } from '../../../types/workout';
import './ExerciseSelector.css';

interface Props {
  onExerciseSelect: (exercise: Exercise) => void;
  localExercises: Exercise[];
  onClose: () => void;
}

export const ExerciseSelector: React.FC<Props> = ({ onExerciseSelect, localExercises, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<WgerExercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WgerExercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 🔍 Поиск ТОЛЬКО в Wger API
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await workoutApi.searchExercises(searchTerm, undefined, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Ошибка поиска упражнений. Попробуйте позже.');
    } finally {
      setIsSearching(false);
    }
  };

  // 💾 Сохранение упражнения в локальную БД + добавление в тренировку
  const handleSelectExercise = async (wgerExercise: WgerExercise) => {
    setIsSaving(true);
    try {
      // 1. Сохраняем в локальную БД (если нет - создаст, если есть - вернёт существующее)
      const savedExercise = await workoutApi.saveExerciseToDb(wgerExercise.id);
      
      // 2. Добавляем в тренировку
      onExerciseSelect(savedExercise);
      
      // 3. Закрываем селектор
      onClose();
    } catch (error: any) {
      console.error('Failed to save exercise:', error);
      alert(`Не удалось сохранить упражнение: ${error.message || 'Ошибка'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 🔤 Быстрый поиск по Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="exercise-selector">
      <div className="selector-header">
        <h3>🔍 Поиск упражнений (Wger API)</h3>
        <button type="button" className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите название упражнения (например: bench press)"
            onKeyPress={handleKeyPress}
            className="form-input"
            autoFocus
          />
          <button 
            type="button" 
            onClick={handleSearch} 
            disabled={isSearching || isSaving}
            className="btn btn-primary"
          >
            {isSearching ? '⏳ Поиск...' : '🔍 Найти'}
          </button>
        </div>

        {/* Индикатор сохранения */}
        {isSaving && (
          <div className="saving-indicator">
            <span className="spinner">⏳</span>
            <span>Сохранение упражнения в базу...</span>
          </div>
        )}

        {/* Результаты поиска */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              <span>Найдено: {searchResults.length}</span>
              <span className="hint">Кликните для добавления в тренировку</span>
            </div>
            
            {searchResults.map((exercise) => (
              <div 
                key={exercise.id} 
                className="exercise-item"
                onClick={() => handleSelectExercise(exercise)}
              >
                <div className="exercise-item-info">
                  <span className="exercise-item-name">
                    {exercise.exerciseName || exercise.name || `Exercise ${exercise.id}`}
                  </span>
                  <span className="exercise-item-id">Wger ID: {exercise.id}</span>
                </div>
                <button 
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectExercise(exercise);
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? '⏳' : '+ Добавить'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Нет результатов */}
        {searchTerm && searchResults.length === 0 && !isSearching && (
          <div className="empty-state">
            <p>😕 Ничего не найдено</p>
            <p className="hint">Попробуйте другой поисковый запрос (лучше на английском)</p>
          </div>
        )}

        {/* Подсказка для первого поиска */}
        {!searchTerm && (
          <div className="empty-state">
            <p>👆 Введите название упражнения для поиска</p>
            <p className="hint">Поиск выполняется в базе Wger API (на английском)</p>
            <div className="popular-searches">
              <p className="popular-label">Популярные запросы:</p>
              <div className="popular-tags">
                <button type="button" onClick={() => { setSearchTerm('bench press'); handleSearch(); }}>
                  Bench Press
                </button>
                <button type="button" onClick={() => { setSearchTerm('squat'); handleSearch(); }}>
                  Squat
                </button>
                <button type="button" onClick={() => { setSearchTerm('deadlift'); handleSearch(); }}>
                  Deadlift
                </button>
                <button type="button" onClick={() => { setSearchTerm('pull up'); handleSearch(); }}>
                  Pull Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Информация о локальных упражнениях */}
      {localExercises.length > 0 && (
        <div className="local-info">
          <p>📚 У вас уже сохранено упражнений: <strong>{localExercises.length}</strong></p>
          <p className="hint">Они будут доступны при создании тренировки</p>
        </div>
      )}
    </div>
  );
};