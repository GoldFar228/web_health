// /src/services/workoutApi.ts

import axios from 'axios';
import type {
  WorkoutSession,
  CreateWorkoutSessionDto,
  Exercise,
  WgerExercise,
  // WgerExerciseListDto
} from '../types/workout';

const API_BASE_URL = 'https://localhost:7073/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const workoutApi = {
  // 📋 Получить все тренировки клиента
  getAllSessions: async (): Promise<WorkoutSession[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/WorkoutSession/GetAllByClient`,
      getAuthHeaders()
    );
    return response.data;
  },

  // 📄 Получить тренировку по ID
  getSessionById: async (id: number): Promise<WorkoutSession> => {
    const response = await axios.get(
      `${API_BASE_URL}/WorkoutSession/GetById/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✅ Создать новую тренировку
  createSession: async (dto: CreateWorkoutSessionDto): Promise<WorkoutSession> => {
    const response = await axios.post(
      `${API_BASE_URL}/WorkoutSession/Create`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✏️ Обновить тренировку
  updateSession: async (id: number, dto: Partial<WorkoutSession>): Promise<WorkoutSession> => {
    const response = await axios.put(
      `${API_BASE_URL}/WorkoutSession/Update/${id}`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  // ❌ Удалить тренировку
  deleteSession: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/WorkoutSession/Delete/${id}`,
      getAuthHeaders()
    );
  },

  // 🏋️ Получить локальные упражнения (из БД)
  getLocalExercises: async (): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Wger/exercises/local`,
      getAuthHeaders()
    );
    return response.data;
  },

  // 🔍 Поиск упражнений в Wger API
  searchExercises: async (
    term?: string,
    category?: number,
    limit: number = 10
  ): Promise<WgerExercise[]> => {
    const params = new URLSearchParams();
    if (term) params.append('term', term);
    if (category) params.append('category', category.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(
      `${API_BASE_URL}/Wger/exercises?${params.toString()}`
    );
    return response.data.results || [];
  },

  // 💾 Сохранить упражнение в локальную БД
  saveExerciseToDb: async (wgerExerciseId: number): Promise<Exercise> => {
    const response = await axios.post(
      `${API_BASE_URL}/Wger/exercises/${wgerExerciseId}/save-to-db`,
      null,
      getAuthHeaders()
    );
    return response.data;
  },

  // 📦 Массовое сохранение упражнений
  saveExercisesBatch: async (exerciseIds: number[]): Promise<Exercise[]> => {
    const response = await axios.post(
      `${API_BASE_URL}/Wger/exercises/search-and-save`,
      exerciseIds,
      getAuthHeaders()
    );
    return response.data.exercises;
  }
};