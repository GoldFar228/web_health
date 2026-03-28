// /src/components/Workout/ExerciseSelectorComponent/ExerciseSelector.tsx

import React, { useState } from 'react';
import { workoutApi } from '../../../services/workoutApi';
import type { Exercise, CreateExerciseDto } from '../../../types/workout';

interface Props {
  onExerciseSelect: (exercise: Exercise) => void;
  localExercises: Exercise[];
}

export const ExerciseSelector: React.FC<Props> = ({ onExerciseSelect, localExercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Для добавления нового упражнения
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExercise, setNewExercise] = useState<CreateExerciseDto>({
    name: '',
    description: '',
    category: '',
    muscleGroup: '',
    imageUrl: ''
  });

  // 🔍 Поиск в локальной БД (вместо Wger API)
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await workoutApi.searchExercises(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // ➕ Добавить новое упражнение
  const handleAddExercise = async () => {
    if (!newExercise.name.trim()) {
      alert('Название упражнения обязательно');
      return;
    }

    try {
      const added = await workoutApi.addExercise(newExercise);
      onExerciseSelect(added);
      setShowAddForm(false);
      setNewExercise({ name: '', description: '', category: '', muscleGroup: '', imageUrl: '' });
    } catch (error) {
      console.error('Failed to add exercise:', error);
      alert('Ошибка добавления упражнения');
    }
  };

  return (
    <div className="exercise-selector">
      <h3>Добавить упражнение</h3>

      {/* 🔍 Поиск по локальной БД */}
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
          <h4>Найдено: {searchResults.length}</h4>
          {searchResults.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <span>{exercise.name}</span>
              {exercise.muscleGroup && (
                <small className="muscle-group">{exercise.muscleGroup}</small>
              )}
              <button onClick={() => onExerciseSelect(exercise)}>
                + Выбрать
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Кнопка добавления нового */}
      <button 
        className="btn-add" 
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Отмена' : '+ Добавить новое упражнение'}
      </button>

      {/* Форма добавления */}
      {showAddForm && (
        <div className="add-exercise-form">
          <h4>Новое упражнение</h4>
          
          <input
            type="text"
            placeholder="Название *"
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
          />
          
          <textarea
            placeholder="Описание"
            value={newExercise.description}
            onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Категория (chest, legs, back...)"
            value={newExercise.category}
            onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="Мышечная группа"
            value={newExercise.muscleGroup}
            onChange={(e) => setNewExercise({ ...newExercise, muscleGroup: e.target.value })}
          />
          
          <input
            type="text"
            placeholder="URL изображения"
            value={newExercise.imageUrl}
            onChange={(e) => setNewExercise({ ...newExercise, imageUrl: e.target.value })}
          />
          
          <button onClick={handleAddExercise}>Сохранить</button>
        </div>
      )}

      {/* Локальные упражнения */}
      {localExercises.length > 0 && (
        <div className="local-exercises">
          <h4>Ваши упражнения ({localExercises.length})</h4>
          {localExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <span>{exercise.name}</span>
              {exercise.muscleGroup && (
                <small className="muscle-group">{exercise.muscleGroup}</small>
              )}
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