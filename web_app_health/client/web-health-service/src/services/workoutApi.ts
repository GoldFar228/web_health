// /src/services/workoutApi.ts

import axios from 'axios';
import type {
  WorkoutSession,
  CreateWorkoutSessionDto,
  Exercise,
  CreateExerciseDto
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

  // ============================================
  // 🏋️ УПРАЖНЕНИЯ - ИСПРАВЛЕНО (локальная БД)
  // ============================================

  // ✅ Получить все упражнения из локальной БД
  getLocalExercises: async (): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/GetExercises`,  // ⚠️ Было: /Wger/exercises/local
      getAuthHeaders()
    );
    return response.data;
  },

  // 🔍 Поиск упражнений по названию (в локальной БД)
  searchExercises: async (
    term: string,
    limit: number = 50
  ): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/SearchExercises/search?term=${encodeURIComponent(term)}`,  // ⚠️ Было: /Wger/exercises
      getAuthHeaders()
    );
    return response.data;
  },

  // 📂 Получить упражнения по категории
  getExercisesByCategory: async (category: string): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/GetByCategory/category/${encodeURIComponent(category)}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // 💪 Получить упражнения по мышечной группе
  getExercisesByMuscleGroup: async (muscleGroup: string): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/GetByMuscle/muscle/${encodeURIComponent(muscleGroup)}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // ➕ Добавить новое упражнение в БД
  addExercise: async (dto: CreateExerciseDto): Promise<Exercise> => {
    const response = await axios.post(
      `${API_BASE_URL}/Exercise/AddExercise`,  // ⚠️ Новый эндпоинт
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  // 📦 Добавить несколько упражнений (batch)
  addExercisesBatch: async (exercises: CreateExerciseDto[]): Promise<Exercise[]> => {
    const response = await axios.post(
      `${API_BASE_URL}/Exercise/AddExercisesBatch/batch`,  // ⚠️ Новый эндпоинт
      exercises,
      getAuthHeaders()
    );
    return response.data.exercises;
  },

  // ✏️ Обновить упражнение
  updateExercise: async (id: number, dto: Partial<Exercise>): Promise<Exercise> => {
    const response = await axios.put(
      `${API_BASE_URL}/Exercise/UpdateExercise/${id}`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  // ❌ Удалить упражнение
  deleteExercise: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/Exercise/DeleteExercise/${id}`,
      getAuthHeaders()
    );
  }
};