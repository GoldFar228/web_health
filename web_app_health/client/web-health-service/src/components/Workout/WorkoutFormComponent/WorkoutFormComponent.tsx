// /src/components/Workout/WorkoutForm.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkoutSession, addExerciseToSession, removeExerciseFromSession, updateExerciseInSession } from '../../../store/workoutSlice';
import { ExerciseSelector } from '../ExerciseSelectorComponent/ExerciseSelector';
import { WorkoutStatusValue, type WorkoutStatus } from '../../../types/workout';
import type { Exercise, CreateWorkoutSessionDto } from '../../../types/workout';
import type { RootState, AppDispatch } from '../../../store/index';  // ✅ Импортируем типы

interface Props {
  localExercises: Exercise[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const WorkoutForm: React.FC<Props> = ({ localExercises, onSuccess, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();  // ✅ Типизируем dispatch
  const currentSession = useSelector((state: RootState) => state.workout.currentSession);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<WorkoutStatus>(WorkoutStatusValue.Completed);  // ✅ Типизировано

  const handleAddExercise = (exercise: Exercise) => {
    dispatch(addExerciseToSession(exercise));
  };

  const handleRemoveExercise = (index: number) => {
    dispatch(removeExerciseFromSession(index));
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    dispatch(updateExerciseInSession({ index, field, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Берём упражнения из Redux store
    const exercises = currentSession?.exercises.map((ex, index) => ({
      exerciseId: ex.exerciseId,
      plannedSets: ex.plannedSets,
      plannedReps: ex.plannedReps,
      plannedWeightKg: ex.plannedWeightKg,
      actualSets: ex.actualSets,
      actualReps: ex.actualReps,
      actualWeightKg: ex.actualWeightKg,
      order: index,
      notes: ex.notes
    })) || [];

    const dto: CreateWorkoutSessionDto = {
      date: new Date(date).toISOString(),
      durationMinutes,
      notes,
      status,  // ✅ Теперь тип корректный
      exercises
    };

    try {
      await dispatch(createWorkoutSession(dto)).unwrap();  // ✅ Без "as any"
      onSuccess();
    } catch (error: any) {
      alert(`Ошибка: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <h2>Новая тренировка</h2>
      
      <div className="form-group">
        <label>Дата:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Длительность (мин):</label>
        <input
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>Заметки:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Статус:</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(Number(e.target.value) as WorkoutStatus)}  // ✅ Cast к типу
        >
          <option value={WorkoutStatusValue.Planned}>Запланирована</option>
          <option value={WorkoutStatusValue.InProgress}>В процессе</option>
          <option value={WorkoutStatusValue.Completed}>Завершена</option>
          <option value={WorkoutStatusValue.Cancelled}>Отменена</option>
        </select>
      </div>

      <ExerciseSelector 
        onExerciseSelect={handleAddExercise} 
        localExercises={localExercises} 
      />

      <div className="selected-exercises">
        <h3>Упражнения в тренировке:</h3>
        {currentSession?.exercises.map((exercise, index) => (
          <div key={index} className="exercise-row">
            <span>{exercise.exerciseName}</span>
            <input
              type="number"
              placeholder="Подходы"
              value={exercise.actualSets}
              onChange={(e) => handleUpdateExercise(index, 'actualSets', Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Повторы"
              value={exercise.actualReps}
              onChange={(e) => handleUpdateExercise(index, 'actualReps', Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Вес (кг)"
              value={exercise.actualWeightKg || ''}
              onChange={(e) => handleUpdateExercise(index, 'actualWeightKg', Number(e.target.value))}
            />
            <button type="button" onClick={() => handleRemoveExercise(index)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="submit">Сохранить тренировку</button>
        <button type="button" onClick={onCancel}>Отмена</button>
      </div>
    </form>
  );
};