// /src/components/Workout/ExerciseSelectorComponent/ExerciseSelector.tsx

import React, { useState } from 'react';
import { workoutApi } from '../../../services/workoutApi';
import type { Exercise } from '../../../types/workout';
import './ExerciseSelector.css';

interface Props {
  onExerciseSelect: (exercise: Exercise) => void;
  localExercises: Exercise[];
}

export const ExerciseSelector: React.FC<Props> = ({ onExerciseSelect, localExercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]); // ✅ Исправлен тип
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // ✅ Исправлено: 2 аргумента (term, limit)
      const results = await workoutApi.searchExercises(searchTerm, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    // ✅ Просто выбираем упражнение (оно уже в локальной БД)
    onExerciseSelect(exercise);
  };

  const handleSelectLocal = (exercise: Exercise) => {
    onExerciseSelect(exercise);
  };

  return (
    <div className="exercise-selector">
      <h3 className="exercise-selector__title">Добавить упражнение</h3>
      
      {/* Поиск */}
      <div className="exercise-selector__search">
        <input
          type="text"
          className="exercise-selector__input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск упражнений..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          className="exercise-selector__btn exercise-selector__btn--search"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="exercise-selector__section">
          <h4 className="exercise-selector__subtitle">Результаты поиска:</h4>
          <ul className="exercise-selector__list">
            {searchResults.map((exercise) => (
              <li key={exercise.id} className="exercise-selector__item">
                <span className="exercise-selector__item-name">
                  {exercise.name}
                </span>
                <button 
                  className="exercise-selector__btn exercise-selector__btn--add"
                  onClick={() => handleSelectExercise(exercise)}
                >
                  + Выбрать
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Локальные упражнения */}
      {localExercises.length > 0 && (
        <div className="exercise-selector__section">
          <h4 className="exercise-selector__subtitle">Ваши упражнения:</h4>
          <ul className="exercise-selector__list">
            {localExercises.map((exercise) => (
              <li key={exercise.id} className="exercise-selector__item">
                <span className="exercise-selector__item-name">{exercise.name}</span>
                <button 
                  className="exercise-selector__btn exercise-selector__btn--select"
                  onClick={() => handleSelectLocal(exercise)}
                >
                  + Выбрать
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};