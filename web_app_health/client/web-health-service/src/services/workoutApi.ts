// /src/services/workoutApi.ts

import axios from 'axios';
import type {
  WorkoutSession,
  CreateWorkoutSessionDto,
  UpdateWorkoutSessionDto,
  UpdateSessionExerciseDto,
  Exercise,
  CreateExerciseDto,
  UpdateWorkoutSessionExerciseDto
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
  // 📋 Сессии
  getAllSessions: async (): Promise<WorkoutSession[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/WorkoutSession/GetAllByClient`,
      getAuthHeaders()
    );
    return response.data;
  },

  getSessionById: async (id: number): Promise<WorkoutSession> => {
    const response = await axios.get(
      `${API_BASE_URL}/WorkoutSession/GetById/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },

  createSession: async (dto: CreateWorkoutSessionDto): Promise<WorkoutSession> => {
    const response = await axios.post(
      `${API_BASE_URL}/WorkoutSession/Create`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  updateSession: async (id: number, dto: UpdateWorkoutSessionDto): Promise<WorkoutSession> => {
    const response = await axios.put(
      `${API_BASE_URL}/WorkoutSession/Update/${id}`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteSession: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/WorkoutSession/Delete/${id}`,
      getAuthHeaders()
    );
  },

  // ✅ Обновление упражнения в сессии (сетов)
  
  updateSessionExercises: async (
    sessionId: number,
    exercises: UpdateWorkoutSessionExerciseDto[]
  ): Promise<WorkoutSession> => {
    const response = await axios.put(
      `${API_BASE_URL}/WorkoutSession/UpdateExercises/${sessionId}/exercises`,
      exercises,
      getAuthHeaders()
    );
    return response.data;
  },

  // 🏋️ Упражнения
  getLocalExercises: async (): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/GetExercises`,
      getAuthHeaders()
    );
    return response.data;
  },

  searchExercises: async (
    term: string,
    limit: number = 50
  ): Promise<Exercise[]> => {
    const response = await axios.get(
      `${API_BASE_URL}/Exercise/SearchExercises/search?term=${encodeURIComponent(term)}`,
      getAuthHeaders()
    );
    return response.data;
  },

  addExercise: async (dto: CreateExerciseDto): Promise<Exercise> => {
    const response = await axios.post(
      `${API_BASE_URL}/Exercise/AddExercise`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  updateExercise: async (id: number, dto: Partial<Exercise>): Promise<Exercise> => {
    const response = await axios.put(
      `${API_BASE_URL}/Exercise/UpdateExercise/${id}`,
      dto,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteExercise: async (id: number): Promise<void> => {
    await axios.delete(
      `${API_BASE_URL}/Exercise/DeleteExercise/${id}`,
      getAuthHeaders()
    );
  }
};