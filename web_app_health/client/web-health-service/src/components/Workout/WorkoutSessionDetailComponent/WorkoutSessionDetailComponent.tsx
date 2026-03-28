// /src/components/Workout/WorkoutSessionDetailComponent/WorkoutSessionDetailComponent.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  deleteWorkoutSession, 
  fetchAllSessions, 
  updateWorkoutSession,
  updateSessionExercises
} from '../../../store/workoutSlice';
import { 
  getWorkoutStatusLabel, 
  getWorkoutStatusClass, 
  WorkoutStatusValue, 
  type WorkoutStatus,
  type WorkoutSet
} from '../../../types/workout';
import type { WorkoutSession, WorkoutSessionExercise } from '../../../types/workout';
import { useAppDispatch } from '../../../store';
import './WorkoutSessionDetailComponent.css';

interface Props {
  session: WorkoutSession;
  onClose: () => void;
  onEdit?: () => void;
}

export const WorkoutSessionDetail: React.FC<Props> = ({ session, onClose, onEdit }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ Состояние для редактирования сессии
  const [editedStatus, setEditedStatus] = useState<WorkoutStatus>(session.status);
  const [editedDuration, setEditedDuration] = useState(session.durationMinutes);
  const [editedNotes, setEditedNotes] = useState(session.notes);
  
  // ✅ ГЛУБОКОЕ КОПИРОВАНИЕ при инициализации (важно!)
  const [editedExercises, setEditedExercises] = useState<WorkoutSessionExercise[]>(
    JSON.parse(JSON.stringify(
      [...session.exercises].sort((a, b) => a.order - b.order)
    ))
  );
  
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      try {
        if (session.id) {
          await dispatch(deleteWorkoutSession(session.id)).unwrap();
          dispatch(fetchAllSessions());
          onClose();
        }
      } catch (error: any) {
        alert(`Ошибка: ${error}`);
      }
    }
  };

  // ✅ Обновление сета в упражнении
  const handleUpdateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    setEditedExercises(prev => {
      const updated = prev.map((ex, idx) => {
        if (idx === exerciseIndex) {
          return {
            ...ex,
            sets: ex.sets.map((set, sIdx) => {
              if (sIdx === setIndex) {
                return { ...set, [field]: value };
              }
              return set;
            })
          };
        }
        return ex;
      });
      return updated;
    });
  };

  // ✅ Добавить сет к упражнению (исправлено)
  const handleAddSet = (exerciseIndex: number) => {
    setEditedExercises(prev => {
      const updated = prev.map((ex, idx) => {
        if (idx === exerciseIndex) {
          const lastSet = ex.sets[ex.sets.length - 1];
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                order: ex.sets.length,
                reps: lastSet?.reps || 10,
                weightKg: lastSet?.weightKg || 0,
                completed: false
              }
            ]
          };
        }
        return ex;
      });
      return updated;
    });
  };

  // ✅ Удалить сет из упражнения (исправлено)
  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setEditedExercises(prev => {
      const updated = prev.map((ex, idx) => {
        if (idx === exerciseIndex && ex.sets.length > 1) {
          const newSets = ex.sets.filter((_, sIdx) => sIdx !== setIndex);
          newSets.forEach((set, idx) => set.order = idx);
          return { ...ex, sets: newSets };
        }
        return ex;
      });
      return updated;
    });
  };

  // ✅ Обновить заметки упражнения (исправлено)
  const handleUpdateExerciseNotes = (exerciseIndex: number, notes: string) => {
    setEditedExercises(prev => {
      const updated = prev.map((ex, idx) => {
        if (idx === exerciseIndex) {
          return { ...ex, notes };
        }
        return ex;
      });
      return updated;
    });
  };

  // ✅ Сохранение всех изменений (без изменений)
  const handleSaveEdit = async () => {
    if (!session.id) return;
    
    setIsSaving(true);
    try {
      // 1. Обновляем основную информацию сессии
      await dispatch(updateWorkoutSession({
        id: session.id,
        dto: {
          id: session.id,
          date: session.date,
          durationMinutes: editedDuration,
          notes: editedNotes,
          status: editedStatus
        }
      })).unwrap();
      
      // 2. Обновляем упражнения
      const exercisesDto = editedExercises.map((ex, index) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        order: index,
        notes: ex.notes || ''
      }));
      
      await dispatch(updateSessionExercises({
        sessionId: session.id,
        exercises: exercisesDto
      })).unwrap();
      
      setIsEditing(false);
      dispatch(fetchAllSessions());
      
      if (onEdit) {
        onEdit();
      }
    } catch (error: any) {
      alert(`Ошибка: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };


  // ✅ Отмена редактирования (с глубоким копированием)
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStatus(session.status);
    setEditedDuration(session.durationMinutes);
    setEditedNotes(session.notes);
    setEditedExercises(
      JSON.parse(JSON.stringify(
        [...session.exercises].sort((a, b) => a.order - b.order)
      ))
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ Подсчёт статистики из отредактированных данных
  const totalTonnage = editedExercises.reduce((sum, ex) => {
    const completedSets = ex.sets.filter(s => s.completed);
    return sum + completedSets.reduce((s, set) => s + (set.reps * set.weightKg), 0);
  }, 0);
  
  const totalSets = editedExercises.reduce((sum, ex) => 
    sum + ex.sets.filter(s => s.completed).length, 0
  );
  
  const totalReps = editedExercises.reduce((sum, ex) => 
    sum + ex.sets.filter(s => s.completed).reduce((s, set) => s + set.reps, 0), 0
  );

  return (
    <div className="session-detail-overlay" onClick={onClose}>
      <div className="session-detail" onClick={(e) => e.stopPropagation()}>
        {/* Заголовок */}
        <div className="session-detail__header">
          <div className="session-detail__title-section">
            <h2 className="session-detail__title">Детали тренировки</h2>
            
            {!isEditing ? (
              <button 
                className="session-detail__edit-btn" 
                onClick={() => setIsEditing(true)}
                title="Редактировать"
              >
                ✏️
              </button>
            ) : (
              <span className="session-detail__edit-mode-badge">Режим редактирования</span>
            )}
          </div>
          <button className="session-detail__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Основная информация */}
        <div className="session-detail__info">
          <div className="session-detail__info-grid">
            <div className="session-detail__info-item">
              <span className="session-detail__info-label">📅 Дата:</span>
              <span className="session-detail__info-value">{formatDate(session.date)}</span>
            </div>
            <div className="session-detail__info-item">
              <span className="session-detail__info-label">⏱️ Длительность:</span>
              {isEditing ? (
                <input
                  type="number"
                  className="session-detail__info-input"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(Number(e.target.value))}
                  min="1"
                />
              ) : (
                <span className="session-detail__info-value">{session.durationMinutes} мин</span>
              )}
            </div>
            <div className="session-detail__info-item">
              <span className="session-detail__info-label">🏋️ Упражнений:</span>
              <span className="session-detail__info-value">{editedExercises.length}</span>
            </div>
            <div className="session-detail__info-item">
              <span className="session-detail__info-label">📊 Статус:</span>
              {isEditing ? (
                <select
                  className="session-detail__info-select"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(Number(e.target.value) as WorkoutStatus)}
                >
                  <option value={WorkoutStatusValue.Planned}>Запланирована</option>
                  <option value={WorkoutStatusValue.InProgress}>В процессе</option>
                  <option value={WorkoutStatusValue.Completed}>Завершена</option>
                  <option value={WorkoutStatusValue.Cancelled}>Отменена</option>
                </select>
              ) : (
                <span className={`session-detail__status session-detail__status--${getWorkoutStatusClass(session.status)}`}>
                  {getWorkoutStatusLabel(session.status)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Заметки к тренировке */}
        <div className="session-detail__notes">
          <h3 className="session-detail__subtitle">📋 Заметки к тренировке</h3>
          {isEditing ? (
            <textarea
              className="session-detail__notes-input"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              rows={3}
              placeholder="Заметки..."
            />
          ) : (
            <p className="session-detail__notes-text">{session.notes || 'Нет заметок'}</p>
          )}
        </div>

        {/* Общая статистика */}
        <div className="session-detail__summary">
          <h3 className="session-detail__subtitle">📊 Общая статистика</h3>
          <div className="session-detail__stats">
            <div className="session-detail__stat-card">
              <span className="session-detail__stat-value">{totalSets}</span>
              <span className="session-detail__stat-label">Выполнено подходов</span>
            </div>
            <div className="session-detail__stat-card">
              <span className="session-detail__stat-value">{totalReps}</span>
              <span className="session-detail__stat-label">Всего повторений</span>
            </div>
            <div className="session-detail__stat-card session-detail__stat-card--tonnage">
              <span className="session-detail__stat-value">{totalTonnage.toFixed(1)}</span>
              <span className="session-detail__stat-label">Тоннаж (кг)</span>
            </div>
          </div>
        </div>

        {/* Упражнения */}
        <div className="session-detail__exercises">
          <h3 className="session-detail__subtitle">
            💪 Упражнения
            {isEditing && <span className="session-detail__edit-hint">(редактируемые)</span>}
          </h3>
          
          {editedExercises.length === 0 ? (
            <div className="session-detail__empty">
              <p>Нет упражнений в этой тренировке</p>
            </div>
          ) : (
            editedExercises.map((exercise, index) => (
              <div key={exercise.id || index} className="session-detail__exercise-card">
                <div className="session-detail__exercise-header">
                  <div className="session-detail__exercise-title">
                    <span className="session-detail__exercise-number">{index + 1}.</span>
                    <span className="session-detail__exercise-name">{exercise.exerciseName || 'Неизвестное упражнение'}</span>
                  </div>
                  {exercise.muscleGroup && (
                    <span className="session-detail__muscle-group">{exercise.muscleGroup}</span>
                  )}
                </div>

                {/* Таблица сетов - РЕДАКТИРУЕМАЯ */}
                {exercise.sets && exercise.sets.length > 0 && (
                  <div className="session-detail__sets-table">
                    <div className="session-detail__sets-header">
                      <span className="session-detail__sets-col">№</span>
                      <span className="session-detail__sets-col">Повторы</span>
                      <span className="session-detail__sets-col">Вес (кг)</span>
                      <span className="session-detail__sets-col">✓</span>
                      {isEditing && <span className="session-detail__sets-col"></span>}
                    </div>
                    
                    {exercise.sets.map((set, setIndex) => (
                      <div 
                        key={setIndex} 
                        className={`session-detail__sets-row ${set.completed ? 'session-detail__sets-row--completed' : ''}`}
                      >
                        <span className="session-detail__sets-col">{set.order + 1}</span>
                        
                        {isEditing ? (
                          <>
                            <input
                              type="number"
                              className="session-detail__sets-input"
                              value={set.reps}
                              onChange={(e) => handleUpdateSet(index, setIndex, 'reps', Number(e.target.value))}
                              min="1"
                            />
                            <input
                              type="number"
                              className="session-detail__sets-input"
                              value={set.weightKg}
                              onChange={(e) => handleUpdateSet(index, setIndex, 'weightKg', Number(e.target.value))}
                              min="0"
                              step="0.5"
                            />
                            <input
                              type="checkbox"
                              className="session-detail__sets-checkbox"
                              checked={set.completed}
                              onChange={(e) => handleUpdateSet(index, setIndex, 'completed', e.target.checked)}
                            />
                            <button
                              type="button"
                              className="session-detail__btn session-detail__btn--remove-set"
                              onClick={() => handleRemoveSet(index, setIndex)}
                              disabled={exercise.sets.length <= 1}
                            >
                              −
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="session-detail__sets-col">{set.reps}</span>
                            <span className="session-detail__sets-col">{set.weightKg}</span>
                            <span className="session-detail__sets-col">
                              {set.completed ? (
                                <span className="session-detail__status-badge session-detail__status-badge--success">
                                  ✓
                                </span>
                              ) : (
                                <span className="session-detail__status-badge session-detail__status-badge--pending">
                                  ○
                                </span>
                              )}
                            </span>
                            <span></span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Кнопка добавить сет (только в режиме редактирования) */}
                {isEditing && (
                  <button
                    type="button"
                    className="session-detail__btn session-detail__btn--add-set"
                    onClick={() => handleAddSet(index)}
                  >
                    + Добавить подход
                  </button>
                )}

                {/* Статистика по упражнению */}
                <div className="session-detail__exercise-stats">
                  <span className="session-detail__stat-badge">
                    ✅ {exercise.sets.filter(s => s.completed).length} подходов
                  </span>
                  <span className="session-detail__stat-badge">
                    🔄 {exercise.sets.filter(s => s.completed).reduce((sum, s) => sum + s.reps, 0)} повторов
                  </span>
                  <span className="session-detail__stat-badge session-detail__stat-badge--tonnage">
                    🏋️ {(exercise.sets.filter(s => s.completed).reduce((sum, s) => sum + (s.reps * s.weightKg), 0)).toFixed(1)} кг
                  </span>
                </div>

                {/* Заметки к упражнению */}
                <div className="session-detail__exercise-notes">
                  <span className="session-detail__notes-label">📝 Заметки:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      className="session-detail__notes-input-inline"
                      value={exercise.notes || ''}
                      onChange={(e) => handleUpdateExerciseNotes(index, e.target.value)}
                      placeholder="Заметки к упражнению..."
                    />
                  ) : (
                    <p className="session-detail__notes-text">{exercise.notes || 'Нет заметок'}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Кнопки действий */}
        <div className="session-detail__actions">
          <button className="session-detail__btn session-detail__btn--close" onClick={onClose}>
            Закрыть
          </button>
          
          {isEditing ? (
            <>
              <button 
                className="session-detail__btn session-detail__btn--cancel" 
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Отмена
              </button>
              <button 
                className="session-detail__btn session-detail__btn--save" 
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? 'Сохранение...' : '💾 Сохранить изменения'}
              </button>
            </>
          ) : (
            <button className="session-detail__btn session-detail__btn--delete" onClick={handleDelete}>
              🗑️ Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};