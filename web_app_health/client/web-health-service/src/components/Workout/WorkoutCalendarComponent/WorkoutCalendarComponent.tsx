// /src/components/Workout/WorkoutCalendar/WorkoutCalendar.tsx

import React, { useState, useMemo } from 'react';
import type { WorkoutSession } from '../../../types/workout';
import './WorkoutCalendarComponent.css';

interface Props {
  sessions: WorkoutSession[];
  onDateClick: (date: Date) => void;
  onSessionClick: (session: WorkoutSession) => void;
}

export const WorkoutCalendar: React.FC<Props> = ({ sessions, onDateClick, onSessionClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ Получаем дни месяца
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    const days: (Date | null)[] = [];
    
    // Пустые ячейки до начала месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentDate]);

  // ✅ Группируем сессии по датам
  const sessionsByDate = useMemo(() => {
    const map: Map<string, WorkoutSession[]> = new Map();
    
    sessions.forEach(session => {
      const dateKey = new Date(session.date).toDateString();
      const existing = map.get(dateKey) || [];
      existing.push(session);
      map.set(dateKey, existing);
    });
    
    return map;
  }, [sessions]);

  // ✅ Навигация по месяцам
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // ✅ Форматирование месяца
  const monthName = currentDate.toLocaleDateString('ru-RU', { 
    month: 'long', 
    year: 'numeric' 
  });

  // ✅ Дни недели
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  // ✅ Проверка, является ли дата сегодня
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // ✅ Получение статуса дня
  const getDayStatus = (date: Date) => {
    const dateKey = date.toDateString();
    const daySessions = sessionsByDate.get(dateKey) || [];
    
    if (daySessions.length === 0) return 'empty';
    
    const hasCompleted = daySessions.some(s => s.status === 2);
    const hasPlanned = daySessions.some(s => s.status === 0);
    
    if (hasCompleted) return 'completed';
    if (hasPlanned) return 'planned';
    return 'scheduled';
  };

  return (
    <div className="workout-calendar">
      {/* Заголовок календаря */}
      <div className="workout-calendar__header">
        <button 
          className="workout-calendar__nav-btn" 
          onClick={previousMonth}
          title="Предыдущий месяц"
        >
          ←
        </button>
        
        <h2 className="workout-calendar__title">
          {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
        </h2>
        
        <button 
          className="workout-calendar__nav-btn" 
          onClick={nextMonth}
          title="Следующий месяц"
        >
          →
        </button>
        
        <button 
          className="workout-calendar__today-btn" 
          onClick={goToToday}
        >
          Сегодня
        </button>
      </div>

      {/* Дни недели */}
      <div className="workout-calendar__weekdays">
        {weekDays.map(day => (
          <div key={day} className="workout-calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Дни месяца */}
      <div className="workout-calendar__grid">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="workout-calendar__day workout-calendar__day--empty"></div>;
          }

          const dateKey = date.toDateString();
          const daySessions = sessionsByDate.get(dateKey) || [];
          const dayStatus = getDayStatus(date);
          const today = isToday(date);

          return (
            <div
              key={dateKey}
              className={`
                workout-calendar__day 
                workout-calendar__day--${dayStatus}
                ${today ? 'workout-calendar__day--today' : ''}
              `}
              onClick={() => onDateClick(date)}
            >
              <div className="workout-calendar__day-number">
                {date.getDate()}
                {today && <span className="workout-calendar__today-indicator">●</span>}
              </div>

              {/* Индикаторы тренировок */}
              {daySessions.length > 0 && (
                <div className="workout-calendar__day-sessions">
                  {daySessions.slice(0, 3).map((session, idx) => (
                    <div
                      key={session.id || idx}
                      className={`
                        workout-calendar__session-dot 
                        workout-calendar__session-dot--${
                          session.status === 2 ? 'completed' :
                          session.status === 1 ? 'in-progress' :
                          session.status === 3 ? 'cancelled' :
                          'planned'
                        }
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSessionClick(session);
                      }}
                      title={`${session.exercises.length} упр. • ${session.durationMinutes} мин`}
                    />
                  ))}
                  {daySessions.length > 3 && (
                    <div className="workout-calendar__session-more">
                      +{daySessions.length - 3}
                    </div>
                  )}
                </div>
              )}

              {/* Кнопка добавить */}
              <button 
                className="workout-calendar__add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDateClick(date);
                }}
                title="Добавить тренировку"
              >
                +
              </button>
            </div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className="workout-calendar__legend">
        <div className="workout-calendar__legend-item">
          <div className="workout-calendar__legend-dot workout-calendar__legend-dot--completed"></div>
          <span>Завершена</span>
        </div>
        <div className="workout-calendar__legend-item">
          <div className="workout-calendar__legend-dot workout-calendar__legend-dot--planned"></div>
          <span>Запланирована</span>
        </div>
        <div className="workout-calendar__legend-item">
          <div className="workout-calendar__legend-dot workout-calendar__legend-dot--in-progress"></div>
          <span>В процессе</span>
        </div>
        <div className="workout-calendar__legend-item">
          <div className="workout-calendar__legend-dot workout-calendar__legend-dot--cancelled"></div>
          <span>Отменена</span>
        </div>
      </div>
    </div>
  );
};