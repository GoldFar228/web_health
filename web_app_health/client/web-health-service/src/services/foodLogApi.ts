import type { CreateMealEntryDto, MealEntryResponseDto, DailySummaryDto } from '../types/mealEntry';

const API_BASE = '/api/MealEntries';

// Получение токена из localStorage (адаптируй под свою схему авторизации)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // или 'access_token'
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const foodLogApi = {
  /**
   * Получить записи за дату
   */
  getEntriesByDate: async (date: string): Promise<MealEntryResponseDto[]> => {
    const response = await fetch(`${API_BASE}?date=${date}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch meal entries');
    }
    
    return response.json();
  },

  /**
   * Получить записи за период
   */
  getEntriesByRange: async (startDate: string, endDate: string): Promise<MealEntryResponseDto[]> => {
    const response = await fetch(
      `${API_BASE}/range?startDate=${startDate}&endDate=${endDate}`,
      {
        method: 'GET',
        headers: getAuthHeaders()
      }
    );
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch meal entries');
    }
    
    return response.json();
  },

  /**
   * Получить сводку за день
   */
  getDailySummary: async (date: string): Promise<DailySummaryDto> => {
    const response = await fetch(`${API_BASE}/summary?date=${date}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to fetch daily summary');
    }
    
    return response.json();
  },

  /**
   * Добавить новую запись
   */
  addEntry: async (dto: CreateMealEntryDto): Promise<MealEntryResponseDto> => {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(dto)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to add meal entry');
    }
    
    return response.json();
  },

  /**
   * Обновить запись
   */
  updateEntry: async (id: number, dto: CreateMealEntryDto): Promise<MealEntryResponseDto> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(dto)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to update meal entry');
    }
    
    return response.json();
  },

  /**
   * Удалить запись
   */
  deleteEntry: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete meal entry');
    }
  }
};