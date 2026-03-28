// /src/components/Workout/WorkoutFormComponent/WorkoutFormComponent.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import type { RootState, AppDispatch } from '../../../store/index';
import './WorkoutFormComponent.css';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const WorkoutForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSession, localExercises } = useSelector((state: RootState) => state.workout);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<WorkoutStatus>(WorkoutStatusValue.Completed);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (!currentSession) {
      dispatch(setCurrentSession({
        date: new Date().toISOString(),
        durationMinutes: 60,
        notes: '',
        status: WorkoutStatusValue.Planned,
        exercises: []
      }));
    }
  }, [dispatch, currentSession]);

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

    // ✅ Агрегируем факты из сетов
    const exercises = currentSession.exercises.map((ex, index) => ({
      exerciseId: ex.exerciseId,
      actualSets: ex.actualSets,
      actualReps: ex.actualReps,
      actualWeightKg: ex.actualWeightKg,
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

  return (
    <div className="workout-form">
      <h2 className="workout-form__title">Новая тренировка</h2>

      <form className="workout-form__body" onSubmit={(e) => e.preventDefault()}>
        {/* Основные поля */}
        <div className="workout-form__fields">
          <div className="workout-form__field">
            <label className="workout-form__label">Дата:</label>
            <input
              type="date"
              className="workout-form__input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="workout-form__field">
            <label className="workout-form__label">Длительность (мин):</label>
            <input
              type="number"
              className="workout-form__input"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              min="1"
              required
            />
          </div>

          <div className="workout-form__field">
            <label className="workout-form__label">Статус:</label>
            <select
              className="workout-form__select"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value) as WorkoutStatus)}
            >
              <option value={WorkoutStatusValue.Planned}>Запланирована</option>
              <option value={WorkoutStatusValue.InProgress}>В процессе</option>
              <option value={WorkoutStatusValue.Completed}>Завершена</option>
              <option value={WorkoutStatusValue.Cancelled}>Отменена</option>
            </select>
          </div>

          <div className="workout-form__field workout-form__field--full">
            <label className="workout-form__label">Заметки:</label>
            <textarea
              className="workout-form__textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Дополнительные заметки..."
            />
          </div>
        </div>

        {/* Selector упражнений */}
        <div className="workout-form__section">
          <ExerciseSelector
            onExerciseSelect={handleAddExercise}
            localExercises={localExercises}
          />
        </div>

        {/* Список упражнений */}
        {exercises.length > 0 && (
          <div className="workout-form__section">
            <h3 className="workout-form__subtitle">Упражнения ({exercises.length})</h3>
            <div className="workout-form__exercises">
              {exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="workout-form__exercise-card">
                  <div className="workout-form__exercise-header">
                    <span className="workout-form__exercise-name">
                      {exercise.exerciseName || `Упражнение #${exercise.exerciseId}`}
                    </span>
                    <button
                      type="button"
                      className="workout-form__btn workout-form__btn--remove"
                      onClick={() => handleRemoveExercise(exIndex)}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Таблица сетов */}
                  <div className="workout-form__sets-table">
                    <div className="workout-form__sets-header">
                      <span className="workout-form__sets-col">№</span>
                      <span className="workout-form__sets-col">Повторы</span>
                      <span className="workout-form__sets-col">Вес (кг)</span>
                      <span className="workout-form__sets-col" title="Отметьте выполненные подходы">
                        ✓ Выполнено
                      </span>
                      <span className="workout-form__sets-col"></span>
                    </div>

                    {exercise.sets.map((set, setIndex) => (
                      <div key={setIndex} className="workout-form__sets-row">
                        <span className="workout-form__sets-col">{setIndex + 1}</span>
                        <input
                          type="number"
                          className="workout-form__sets-input"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(exIndex, setIndex, 'reps', Number(e.target.value))}
                          min="1"
                        />
                        <input
                          type="number"
                          className="workout-form__sets-input"
                          value={set.weightKg}
                          onChange={(e) => handleUpdateSet(exIndex, setIndex, 'weightKg', Number(e.target.value))}
                          min="0"
                          step="0.5"
                        />
                        <div className="workout-form__sets-col workout-form__checkbox-wrapper">
                          <input
                            type="checkbox"
                            className="workout-form__sets-checkbox"
                            checked={set.completed}
                            onChange={(e) => handleUpdateSet(exIndex, setIndex, 'completed', e.target.checked)}
                            id={`set-${exIndex}-${setIndex}-completed`}
                          />
                          <label
                            htmlFor={`set-${exIndex}-${setIndex}-completed`}
                            className="workout-form__checkbox-label"
                            title="Отметьте, если подход выполнен"
                          >
                            ✓
                          </label>
                        </div>
                        <button
                          type="button"
                          className="workout-form__btn workout-form__btn--remove-set"
                          onClick={() => handleRemoveSet(exIndex, setIndex)}
                          disabled={exercise.sets.length <= 1}
                          title="Удалить подход"
                        >
                          −
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Кнопка добавить сет */}
                  <button
                    type="button"
                    className="workout-form__btn workout-form__btn--add-set"
                    onClick={() => handleAddSet(exIndex)}
                  >
                    + Добавить подход
                  </button>

                  {/* Итого по упражнению */}
                  <div className="workout-form__exercise-summary">
                    <span className="workout-form__summary-badge">
                      ✅ {exercise.actualSets} из {exercise.sets.length} подходов
                    </span>
                    <span className="workout-form__summary-badge">
                      🔄 {exercise.actualReps} повторов
                    </span>
                    <span className="workout-form__summary-badge">
                      🏋️ {exercise.actualWeightKg} кг (сред.)
                    </span>
                    <span className="workout-form__summary-badge workout-form__summary-badge--info" title="Только выполненные подходы учитываются">
                      ℹ️ Только ✓ подсчитываются
                    </span>
                  </div>

                  {/* Заметки */}
                  <div className="workout-form__exercise-notes">
                    <label>Заметки:</label>
                    <input
                      type="text"
                      className="workout-form__input-full"
                      value={exercise.notes || ''}
                      onChange={(e) => handleUpdateExercise(exIndex, 'notes', e.target.value)}
                      placeholder="Заметки к упражнению..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки */}
        <div className="workout-form__actions">
          <button
            type="button"
            className="workout-form__btn workout-form__btn--cancel"
            onClick={handleCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="workout-form__btn workout-form__btn--save"
            onClick={handleSaveSession}
            disabled={isSaving || exercises.length === 0}
          >
            {isSaving ? 'Сохранение...' : '💾 Сохранить тренировку'}
          </button>
        </div>
      </form>
    </div>
  );
};