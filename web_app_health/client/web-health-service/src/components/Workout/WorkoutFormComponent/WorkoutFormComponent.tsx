// /src/components/Workout/WorkoutForm.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWorkoutSession, addExerciseToSession, removeExerciseFromSession, updateExerciseInSession, clearCurrentSession } from '../../../store/workoutSlice';
import { ExerciseSelector } from '../ExerciseSelectorComponent/ExerciseSelector';
import { WorkoutStatusValue, type WorkoutStatus, type Exercise } from '../../../types/workout';
import type { RootState, AppDispatch } from '../../../store/index';
import './WorkoutFormComponent.css';

interface Props {
  localExercises: Exercise[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const WorkoutForm: React.FC<Props> = ({ localExercises, onSuccess, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentSession = useSelector((state: RootState) => state.workout.currentSession);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<WorkoutStatus>(WorkoutStatusValue.Completed);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    dispatch(addExerciseToSession(exercise));
    // Селектор закроется сам через onClose в ExerciseSelector
  };

  const handleRemoveExercise = (index: number) => {
    dispatch(removeExerciseFromSession(index));
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    dispatch(updateExerciseInSession({ index, field, value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение!');
      return;
    }

    const dto = {
      date: new Date(date).toISOString(),
      durationMinutes,
      notes,
      status,
      exercises
    };

    try {
      await dispatch(createWorkoutSession(dto)).unwrap();
      dispatch(clearCurrentSession());
      onSuccess();
    } catch (error: any) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleCancel = () => {
    dispatch(clearCurrentSession());
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <div className="form-header">
        <h2>🏋️ Новая тренировка</h2>
        <button type="button" className="close-btn" onClick={handleCancel}>✕</button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="date">📅 Дата</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">⏱️ Длительность (мин)</label>
          <input
            id="duration"
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            min="1"
            max="300"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">📊 Статус</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(Number(e.target.value) as WorkoutStatus)}
            className="form-input"
          >
            <option value={WorkoutStatusValue.Planned}>Запланирована</option>
            <option value={WorkoutStatusValue.InProgress}>В процессе</option>
            <option value={WorkoutStatusValue.Completed}>Завершена</option>
            <option value={WorkoutStatusValue.Cancelled}>Отменена</option>
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="notes">📝 Заметки</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Опишите вашу тренировку..."
          className="form-input"
        />
      </div>

      {/* Секция упражнений */}
      <div className="exercises-section">
        <div className="exercises-header">
          <h3>💪 Упражнения ({currentSession?.exercises.length || 0})</h3>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowExerciseSelector(!showExerciseSelector)}
          >
            {showExerciseSelector ? 'Скрыть' : '+ Добавить упражнение'}
          </button>
        </div>


        {showExerciseSelector && (
          <div className="exercise-selector-modal">
            <ExerciseSelector
              onExerciseSelect={handleAddExercise}
              localExercises={localExercises}
              onClose={() => setShowExerciseSelector(false)}
            />
          </div>
        )}

        {/* Список выбранных упражнений */}
        {currentSession?.exercises && currentSession.exercises.length > 0 ? (
          <div className="exercises-list">
            {currentSession.exercises.map((exercise, index) => (
              <div key={index} className="exercise-card">
                <div className="exercise-card-header">
                  <div className="exercise-info">
                    <span className="exercise-order">#{index + 1}</span>
                    <h4>{exercise.exerciseName || 'Упражнение'}</h4>
                    {exercise.muscleGroup && (
                      <span className="exercise-muscle">{exercise.muscleGroup}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveExercise(index)}
                    title="Удалить упражнение"
                  >
                    🗑️
                  </button>
                </div>

                <div className="exercise-inputs">
                  <div className="input-group">
                    <label>Планируется</label>
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder="Подходы"
                        value={exercise.plannedSets || ''}
                        onChange={(e) => handleUpdateExercise(index, 'plannedSets', Number(e.target.value))}
                        min="0"
                        className="form-input-small"
                      />
                      <input
                        type="number"
                        placeholder="Повторы"
                        value={exercise.plannedReps || ''}
                        onChange={(e) => handleUpdateExercise(index, 'plannedReps', Number(e.target.value))}
                        min="0"
                        className="form-input-small"
                      />
                      <input
                        type="number"
                        placeholder="Вес (кг)"
                        value={exercise.plannedWeightKg || ''}
                        onChange={(e) => handleUpdateExercise(index, 'plannedWeightKg', Number(e.target.value))}
                        min="0"
                        step="0.5"
                        className="form-input-small"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>✅ Выполнено</label>
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder="Подходы"
                        value={exercise.actualSets}
                        onChange={(e) => handleUpdateExercise(index, 'actualSets', Number(e.target.value))}
                        min="0"
                        required
                        className="form-input-small"
                      />
                      <input
                        type="number"
                        placeholder="Повторы"
                        value={exercise.actualReps}
                        onChange={(e) => handleUpdateExercise(index, 'actualReps', Number(e.target.value))}
                        min="0"
                        required
                        className="form-input-small"
                      />
                      <input
                        type="number"
                        placeholder="Вес (кг)"
                        value={exercise.actualWeightKg || ''}
                        onChange={(e) => handleUpdateExercise(index, 'actualWeightKg', Number(e.target.value))}
                        min="0"
                        step="0.5"
                        className="form-input-small"
                      />
                    </div>
                  </div>

                  <div className="input-group full-width">
                    <label>Заметки к упражнению</label>
                    <input
                      type="text"
                      placeholder="Комментарий..."
                      value={exercise.notes}
                      onChange={(e) => handleUpdateExercise(index, 'notes', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-exercises">
            <p> Добавьте упражнения, чтобы создать тренировку</p>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-large">
          💾 Сохранить тренировку
        </button>
        <button type="button" className="btn btn-secondary btn-large" onClick={handleCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
};