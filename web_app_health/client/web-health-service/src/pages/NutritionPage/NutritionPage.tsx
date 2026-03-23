import React, { useState, useEffect } from 'react';
import type { MealEntryResponseDto, DailySummaryDto, CreateMealEntryDto } from '../../types/mealEntry';
import { foodLogApi } from '../../services/foodLogApi';
import { MealEntryForm } from '../../components/Nutrition/MealEntryForm/MealEntryForm';
import { MealEntryList } from '../../components/Nutrition/MealEntryList/MealEntryList';
import { DailySummary } from '../../components/Nutrition/DailySummary/DailySummary';
import "./NutritionPage.css"

export const NutritionPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [entries, setEntries] = useState<MealEntryResponseDto[]>([]);
  const [summary, setSummary] = useState<DailySummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MealEntryResponseDto | null>(null);

  // Загрузка данных при изменении даты
  useEffect(() => {
    console.log(selectedDate);
    
    loadDayData(selectedDate);
  }, [selectedDate]);

  const loadDayData = async (date: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const [entriesData, summaryData] = await Promise.all([
        foodLogApi.getEntriesByDate(date),
        foodLogApi.getDailySummary(date)
      ]);
      
      setEntries(entriesData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setShowForm(false);
    loadDayData(selectedDate);
  };

  const handleDeleteSuccess = () => {
    loadDayData(selectedDate);
  };

  const handleEdit = (entry: MealEntryResponseDto) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  return (
    <div className="nutrition-page">
      <header className="page-header">
        <h1>🍽️ Дневник питания</h1>
      </header>

      {/* Навигация по датам */}
      <div className="date-navigation">
        <button onClick={() => navigateDate(-1)} className="btn-nav">←</button>
        
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="date-picker"
        />
        
        <button onClick={() => navigateDate(1)} className="btn-nav">→</button>
        
        <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="btn-today">
          Сегодня
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => loadDayData(selectedDate)}>Повторить</button>
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">Загрузка...</div>
      ) : (
        <>
          {/* Сводка за день */}
          {summary && <DailySummary summary={summary} />}

          {/* Кнопка добавления */}
          <div className="actions-bar">
            <button 
              onClick={() => { setShowForm(true); setEditingEntry(null); }} 
              className="btn-add"
            >
              ➕ Добавить приём пищи
            </button>
          </div>

          {/* Форма добавления/редактирования */}
          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <MealEntryForm
                  onSuccess={handleAddSuccess}
                  onCancel={() => setShowForm(false)}
                  initialDate={selectedDate}
                />
              </div>
            </div>
          )}

          {/* Список записей */}
          <MealEntryList
            entries={entries}
            onEntryDeleted={handleDeleteSuccess}
            onEntryEdited={handleEdit}
          />
        </>
      )}
    </div>
  );
};