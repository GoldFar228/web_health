// /src/components/Workout/ExerciseSelector.tsx

import React, { useState } from 'react';
import { workoutApi } from '../../../services/workoutApi';
import type { Exercise, WgerExercise } from '../../../types/workout';

interface Props {
  onExerciseSelect: (exercise: Exercise) => void;
  localExercises: Exercise[];
}

export const ExerciseSelector: React.FC<Props> = ({ onExerciseSelect, localExercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<WgerExercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await workoutApi.searchExercises(searchTerm, undefined, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAndSelect = async (wgerExercise: WgerExercise) => {
    try {
      const savedExercise = await workoutApi.saveExerciseToDb(wgerExercise.id);
      onExerciseSelect(savedExercise);
    } catch (error) {
      console.error('Failed to save exercise:', error);
    }
  };

  return (
    <div className="exercise-selector">
      <h3>Добавить упражнение</h3>
      
      {/* Поиск в Wger */}
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск упражнений..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Результаты поиска:</h4>
          {searchResults.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <span>{exercise.exerciseName || exercise.name || `Exercise ${exercise.id}`}</span>
              <button onClick={() => handleSaveAndSelect(exercise)}>
                + Добавить
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Локальные упражнения */}
      {localExercises.length > 0 && (
        <div className="local-exercises">
          <h4>Ваши упражнения:</h4>
          {localExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <span>{exercise.name}</span>
              <button onClick={() => onExerciseSelect(exercise)}>
                + Выбрать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};