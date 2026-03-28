// /src/pages/WorkoutPage/WorkoutPage.tsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSessions,
  deleteWorkoutSession,
  fetchLocalExercises
} from '../../store/workoutSlice';
import { WorkoutCalendar } from '../../components/Workout/WorkoutCalendarComponent/WorkoutCalendarComponent';
import { WorkoutForm } from '../../components/Workout/WorkoutFormComponent/WorkoutFormComponent';
import { WorkoutSessionDetail } from '../../components/Workout/WorkoutSessionDetailComponent/WorkoutSessionDetailComponent';
import type { WorkoutSession } from '../../types/workout';
import { type RootState, type AppDispatch, useAppDispatch, useAppSelector } from '../../store/index';
import './WorkoutPage.css';

export const WorkoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sessions, loading, error } = useAppSelector((state) => state.workout);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    dispatch(fetchAllSessions());
    dispatch(fetchLocalExercises());
  }, [dispatch]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // ✅ Проверяем, есть ли сессии на эту дату
    const dateKey = date.toDateString();
    const sessionsOnDate = sessions.filter(s =>
      new Date(s.date).toDateString() === dateKey
    );

    if (sessionsOnDate.length === 0) {
      // ✅ Нет сессий — открываем форму создания
      setIsFormOpen(true);
    } else if (sessionsOnDate.length === 1) {
      // ✅ Одна сессия — открываем детали
      setSelectedSession(sessionsOnDate[0]);
    } else {
      // ✅ Несколько сессий — показываем первую (можно улучшить)
      setSelectedSession(sessionsOnDate[0]);
    }
  };

  const handleSessionClick = (session: WorkoutSession) => {
    setSelectedSession(session);
  };

  const handleEditSession = () => {
    console.log('Тренировка обновлена');
  };
  const handleSuccess = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
    dispatch(fetchAllSessions());
    dispatch(fetchLocalExercises());
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedDate(null);
  };

  const handleCloseDetails = () => {
    setSelectedSession(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      try {
        await dispatch(deleteWorkoutSession(id)).unwrap();
        dispatch(fetchAllSessions());
      } catch (error: any) {
        alert(`Ошибка: ${error}`);
      }
    }
  };

  return (
    <div className="workout-page">
      <div className="workout-page__header">
        <h1 className="workout-page__title">🏋️ Календарь тренировок</h1>
        <button
          className="workout-page__btn workout-page__btn--primary"
          onClick={() => {
            setSelectedDate(new Date());
            setIsFormOpen(true);
          }}
        >
          + Новая тренировка
        </button>
      </div>

      {loading && <div className="workout-page__loading">Загрузка...</div>}
      {error && <div className="workout-page__error">Ошибка: {error}</div>}

      {/* Календарь */}
      <WorkoutCalendar
        sessions={sessions}
        onDateClick={handleDateClick}
        onSessionClick={handleSessionClick}
      />

      {/* Форма создания */}
      {isFormOpen && (
        <WorkoutForm
          isOpen={isFormOpen}  // ✅ Передаём prop
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* Детали сессии */}
      {selectedSession && (
        <WorkoutSessionDetail
          session={selectedSession}
          onClose={handleCloseDetails}
          onEdit={handleEditSession}
        />
      )}
    </div>
  );
};