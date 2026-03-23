import React, { useState } from 'react';
import type { MealEntryResponseDto } from '../../../types/mealEntry';
import { foodLogApi } from '../../../services/foodLogApi';

interface MealEntryListProps {
  entries: MealEntryResponseDto[];
  onEntryDeleted: () => void;
  onEntryEdited: (entry: MealEntryResponseDto) => void;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: '🌅 Завтрак',
  lunch: '☀️ Обед',
  dinner: '🌙 Ужин',
  snack: '🍎 Перекус',
  other: '📝 Другое'
};

export const MealEntryList: React.FC<MealEntryListProps> = ({
  entries,
  onEntryDeleted,
  onEntryEdited
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    setDeletingId(id);
    try {
      await foodLogApi.deleteEntry(id);
      onEntryDeleted();
    } catch (err) {
      alert('Ошибка при удалении: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>🍽️ Записей за выбранный день пока нет</p>
        <p className="hint">Добавьте первый приём пищи!</p>
      </div>
    );
  }

  // Группировка по типу приёма пищи
  const groupedEntries = entries.reduce((acc, entry) => {
    const type = entry.mealType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(entry);
    return acc;
  }, {} as Record<string, MealEntryResponseDto[]>);

  const sortedTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'other'];

  return (
    <div className="meal-entry-list">
      {sortedTypes.map(type => {
        const typeEntries = groupedEntries[type];
        if (!typeEntries || typeEntries.length === 0) return null;

        return (
          <div key={type} className="meal-group">
            <h4 className="meal-group-title">{mealTypeLabels[type]}</h4>
            
            <div className="meal-cards">
              {typeEntries.map(entry => (
                <div key={entry.id} className="meal-card">
                  <div className="meal-card-header">
                    <div className="meal-info">
                      <h5>{entry.foodName}</h5>
                      {entry.brand && <span className="meal-brand">{entry.brand}</span>}
                      <span className="meal-quantity">
                        {entry.quantity} {entry.unit}
                      </span>
                    </div>
                    
                    <div className="meal-time">
                      {entry.entryTime && (
                        <span className="time-badge">
                          {entry.entryTime.substring(0, 5)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="meal-nutrition">
                    <span className="nutrition-item calories">
                      🔥 {entry.calories} ккал
                    </span>
                    <span className="nutrition-item protein">
                      🥩 {entry.protein}г бел
                    </span>
                    <span className="nutrition-item carbs">
                      🍞 {entry.carbohydrates}г угл
                    </span>
                    <span className="nutrition-item fat">
                      🧈 {entry.fat}г жир
                    </span>
                  </div>

                  {entry.notes && (
                    <p className="meal-notes">{entry.notes}</p>
                  )}

                  <div className="meal-actions">
                    <button
                      onClick={() => onEntryEdited(entry)}
                      className="btn-edit"
                      disabled={deletingId === entry.id}
                    >
                      ✏️ Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="btn-delete"
                      disabled={deletingId === entry.id}
                    >
                      {deletingId === entry.id ? '⏳' : '🗑️ Удалить'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};