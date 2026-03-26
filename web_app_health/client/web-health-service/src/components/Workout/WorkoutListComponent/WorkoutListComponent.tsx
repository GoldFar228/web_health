// /src/components/Workout/WorkoutList.tsx

import React from 'react';
import type { WorkoutSession } from '../../../types/workout';

interface Props {
  sessions: WorkoutSession[];
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const WorkoutList: React.FC<Props> = ({ sessions, onDelete, onView }) => {
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Запланирована';
      case 1: return 'В процессе';
      case 2: return 'Завершена';
      case 3: return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  const getStatusClass = (status: number) => {
    switch (status) {
      case 0: return 'status-planned';
      case 1: return 'status-in-progress';
      case 2: return 'status-completed';
      case 3: return 'status-cancelled';
      default: return '';
    }
  };

  if (sessions.length === 0) {
    return <div className="empty-state">У вас пока нет тренировок</div>;
  }

  return (
    <div className="workout-list">
      <h2>Мои тренировки</h2>
      {sessions.map((session) => (
        <div key={session.id} className="workout-card">
          <div className="workout-header">
            <h3>{new Date(session.date).toLocaleDateString('ru-RU')}</h3>
            <span className={`status-badge ${getStatusClass(session.status)}`}>
              {getStatusLabel(session.status)}
            </span>
          </div>
          
          <div className="workout-info">
            <p>⏱️ {session.durationMinutes} мин</p>
            <p>🏋️ {session.exercises?.length || 0} упражнений</p>
          </div>

          {session.notes && (
            <p className="workout-notes">{session.notes}</p>
          )}

          <div className="workout-actions">
            <button onClick={() => onView(session.id!)}>
              Просмотр
            </button>
            <button onClick={() => onDelete(session.id!)} className="delete-btn">
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};