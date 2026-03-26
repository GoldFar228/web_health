// /src/pages/WorkoutPage/WorkoutPage.tsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSessions, fetchLocalExercises, deleteWorkoutSession, clearError } from '../../store/workoutSlice';
import { WorkoutList } from '../../components/Workout/WorkoutListComponent/WorkoutListComponent';
import { WorkoutForm } from '../../components/Workout/WorkoutFormComponent/WorkoutFormComponent';
import type { RootState, AppDispatch } from '../../store/index';  // ✅ Импортируем типы

export const WorkoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();  // ✅ Типизируем dispatch
  const { sessions, localExercises, loading, error, currentSession } = useSelector(
    (state: RootState) => state.workout
  );

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSessions());
    dispatch(fetchLocalExercises());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      try {
        await dispatch(deleteWorkoutSession(id)).unwrap();
      } catch (err: any) {
        alert(`Ошибка: ${err}`);
      }
    }
  };

  const handleView = (id: number) => {
    console.log('View workout:', id);
  };

  return (
    <div className="workout-page">
      <div className="page-header">
        <h1>🏋️ Мои тренировки</h1>
        <button 
          className="primary-btn" 
          onClick={() => setShowForm(true)}
        >
          + Новая тренировка
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => dispatch(clearError())}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : showForm ? (
        <WorkoutForm 
          localExercises={localExercises}
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <WorkoutList 
          sessions={sessions}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}
    </div>
  );
};