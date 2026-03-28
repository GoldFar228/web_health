// /src/components/Workout/WorkoutFormComponent/WorkoutFormComponent.tsx

import React, { useState } from 'react';
import { 
  createWorkoutSession, 
  addExerciseToSession, 
  removeExerciseFromSession, 
  updateExerciseInSession,
  updateSetInExercise,
  addSetToExercise,
  removeSetFromExercise,
  setCurrentSession
} from '../../../store/workoutSlice';
import { ExerciseSelector } from '../ExerciseSelectorComponent/ExerciseSelector';
import { WorkoutStatusValue, type WorkoutStatus } from '../../../types/workout';
import type { Exercise, CreateWorkoutSessionDto } from '../../../types/workout';
import { useAppDispatch, useAppSelector } from '../../../store';
import './WorkoutFormComponent.css';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;  // ✅ Добавляем prop
}

export const WorkoutForm: React.FC<Props> = ({ onSuccess, onCancel, isOpen }) => {
  const dispatch = useAppDispatch();
  const { currentSession, localExercises } = useAppSelector((state) => state.workout);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<WorkoutStatus>(WorkoutStatusValue.Completed);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (!currentSession && isOpen) {
      dispatch(setCurrentSession({
        date: new Date().toISOString(),
        durationMinutes: 60,
        notes: '',
        status: WorkoutStatusValue.Planned,
        exercises: []
      }));
    }
  }, [dispatch, currentSession, isOpen]);

  // ✅ Сброс формы при закрытии
  React.useEffect(() => {
    if (!isOpen) {
      dispatch(setCurrentSession(null));
    }
  }, [isOpen, dispatch]);

  const handleAddExercise = (exercise: Exercise) => {
    dispatch(addExerciseToSession(exercise));
  };

  const handleRemoveExercise = (index: number) => {
    dispatch(removeExerciseFromSession(index));
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    dispatch(updateExerciseInSession({ index, field, value }));
  };

  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    dispatch(updateSetInExercise({ exerciseIndex, setIndex, field: field as any, value }));
  };

  const handleAddSet = (exerciseIndex: number) => {
    dispatch(addSetToExercise({ exerciseIndex }));
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    dispatch(removeSetFromExercise({ exerciseIndex, setIndex }));
  };

  const handleSaveSession = async () => {
    if (!currentSession?.exercises || currentSession.exercises.length === 0) {
      alert('Добавьте хотя бы одно упражнение!');
      return;
    }

    setIsSaving(true);

    const exercises = currentSession.exercises.map((ex, index) => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      order: index,
      notes: ex.notes || ''
    }));

    const dto: CreateWorkoutSessionDto = {
      date: new Date(date).toISOString(),
      durationMinutes,
      notes,
      status,
      exercises
    };

    try {
      await dispatch(createWorkoutSession(dto)).unwrap();
      onSuccess();
    } catch (error: any) {
      alert(`Ошибка: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    dispatch(setCurrentSession(null));
    onCancel();
  };

  const exercises = currentSession?.exercises || [];

  // ✅ Не рендерим, если закрыто (оптимизация)
  if (!isOpen) return null;

  return (
    <>
      {/* ✅ Overlay (просто затемнение, без blur) */}
      <div 
        className="workout-drawer-overlay" 
        onClick={handleCancel}
        aria-hidden="true"
      />
      
      {/* ✅ Drawer панель */}
      <div className={`workout-drawer ${isOpen ? 'workout-drawer--open' : ''}`}>
        <div className="workout-drawer__header">
          <h2 className="workout-drawer__title">💪 Новая тренировка</h2>
          <button 
            className="workout-drawer__close-btn" 
            onClick={handleCancel}
            title="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="workout-drawer__content">
          <form className="workout-drawer__form" onSubmit={(e) => e.preventDefault()}>
            {/* Основные поля */}
            <div className="workout-drawer__fields">
              <div className="workout-drawer__field">
                <label className="workout-drawer__label">Дата:</label>
                <input
                  type="date"
                  className="workout-drawer__input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="workout-drawer__field">
                <label className="workout-drawer__label">Длительность (мин):</label>
                <input
                  type="number"
                  className="workout-drawer__input"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>

              <div className="workout-drawer__field">
                <label className="workout-drawer__label">Статус:</label>
                <select
                  className="workout-drawer__select"
                  value={status}
                  onChange={(e) => setStatus(Number(e.target.value) as WorkoutStatus)}
                >
                  <option value={WorkoutStatusValue.Planned}>Запланирована</option>
                  <option value={WorkoutStatusValue.InProgress}>В процессе</option>
                  <option value={WorkoutStatusValue.Completed}>Завершена</option>
                  <option value={WorkoutStatusValue.Cancelled}>Отменена</option>
                </select>
              </div>

              <div className="workout-drawer__field workout-drawer__field--full">
                <label className="workout-drawer__label">Заметки:</label>
                <textarea
                  className="workout-drawer__textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Дополнительные заметки..."
                />
              </div>
            </div>

            {/* Selector упражнений */}
            <div className="workout-drawer__section">
              <ExerciseSelector 
                onExerciseSelect={handleAddExercise}
                localExercises={localExercises}
              />
            </div>

            {/* Список упражнений */}
            {exercises.length > 0 && (
              <div className="workout-drawer__section">
                <h3 className="workout-drawer__subtitle">
                  Упражнения ({exercises.length})
                </h3>
                <div className="workout-drawer__exercises">
                  {exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="workout-drawer__exercise-card">
                      <div className="workout-drawer__exercise-header">
                        <span className="workout-drawer__exercise-name">
                          {exercise.exerciseName || `Упражнение #${exercise.exerciseId}`}
                        </span>
                        <button
                          type="button"
                          className="workout-drawer__btn workout-drawer__btn--remove"
                          onClick={() => handleRemoveExercise(exIndex)}
                        >
                          ✕
                        </button>
                      </div>
                      
                      {/* Таблица сетов */}
                      <div className="workout-drawer__sets-table">
                        <div className="workout-drawer__sets-header">
                          <span className="workout-drawer__sets-col">№</span>
                          <span className="workout-drawer__sets-col">Повторы</span>
                          <span className="workout-drawer__sets-col">Вес</span>
                          <span className="workout-drawer__sets-col">✓</span>
                          <span></span>
                        </div>
                        
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="workout-drawer__sets-row">
                            <span className="workout-drawer__sets-col">{setIndex + 1}</span>
                            <input
                              type="number"
                              className="workout-drawer__sets-input"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
                              min="1"
                            />
                            <input
                              type="number"
                              className="workout-drawer__sets-input"
                              value={set.weightKg}
                              onChange={(e) => handleUpdateSet(exIndex, setIndex, 'weightKg', Number(e.target.value))}
                              min="0"
                              step="0.5"
                            />
                            <input
                              type="checkbox"
                              className="workout-drawer__sets-checkbox"
                              checked={set.completed}
                              onChange={(e) => handleUpdateSet(exIndex, setIndex, 'completed', e.target.checked)}
                            />
                            <button
                              type="button"
                              className="workout-drawer__btn workout-drawer__btn--remove-set"
                              onClick={() => handleRemoveSet(exIndex, setIndex)}
                              disabled={exercise.sets.length <= 1}
                            >
                              −
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        type="button"
                        className="workout-drawer__btn workout-drawer__btn--add-set"
                        onClick={() => handleAddSet(exIndex)}
                      >
                        + Подход
                      </button>

                      <div className="workout-drawer__exercise-summary">
                        <span className="workout-drawer__summary-badge">
                          ✅ {exercise.completedSets} подходов
                        </span>
                        <span className="workout-drawer__summary-badge">
                          🏋️ {exercise.totalTonnage.toFixed(0)} кг
                        </span>
                      </div>

                      <div className="workout-drawer__exercise-notes">
                        <input
                          type="text"
                          className="workout-drawer__input-full"
                          value={exercise.notes || ''}
                          onChange={(e) => handleUpdateExercise(exIndex, 'notes', e.target.value)}
                          placeholder="Заметки..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Кнопки действий (fixed внизу) */}
        <div className="workout-drawer__footer">
          <button
            type="button"
            className="workout-drawer__btn workout-drawer__btn--cancel"
            onClick={handleCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="workout-drawer__btn workout-drawer__btn--save"
            onClick={handleSaveSession}
            disabled={isSaving || exercises.length === 0}
          >
            {isSaving ? 'Сохранение...' : '💾 Сохранить'}
          </button>
        </div>
      </div>
    </>
  );
};