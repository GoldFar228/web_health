// /src/types/workout.ts

export type WorkoutStatus = 0 | 1 | 2 | 3;

export const WorkoutStatusValue = {
  Planned: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3
} as const;

export const getWorkoutStatusLabel = (status: WorkoutStatus): string => {
  switch (status) {
    case 0: return 'Запланирована';
    case 1: return 'В процессе';
    case 2: return 'Завершена';
    case 3: return 'Отменена';
    default: return 'Неизвестно';
  }
};

export const getWorkoutStatusClass = (status: WorkoutStatus): string => {
  switch (status) {
    case 0: return 'status-planned';
    case 1: return 'status-in-progress';
    case 2: return 'status-completed';
    case 3: return 'status-cancelled';
    default: return '';
  }
};
// ============================================
// Упражнения
// ============================================

export interface Exercise {
  id: number;
  wgerExerciseId: number;
  name: string;
  category?: string;
  muscleGroup?: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateExerciseDto {
  wgerExerciseId?: number;
  name: string;
  description?: string;
  category?: string;
  muscleGroup?: string;
  imageUrl?: string;
}

// ============================================
// Сеты (подходы)
// ============================================

export interface WorkoutSet {
  order: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

// ============================================
// Тренировочные сессии
// ============================================

export interface WorkoutSessionExercise {
  id?: number;
  exerciseId: number;
  exerciseName?: string;
  muscleGroup?: string;
  
  // ✅ Массив сетов (полные данные)
  sets: WorkoutSet[];
  
  // ✅ Агрегаты
  completedSets: number;
  totalReps: number;
  totalTonnage: number;  // ✅ кг × повторения
  
  order: number;
  notes: string;
}

export interface WorkoutSession {
  id?: number;
  clientId?: number;
  date: string;
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
  exercises: WorkoutSessionExercise[];
}

// ============================================
// DTO для API запросов
// ============================================

export interface CreateWorkoutSessionExerciseDto {
  exerciseId: number;
  sets: WorkoutSet[];  // ✅ Полный массив сетов
  order: number;
  notes: string;
}

export interface CreateWorkoutSessionDto {
  date: string;
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
  exercises: CreateWorkoutSessionExerciseDto[];
}

export interface UpdateWorkoutSessionDto {
  id: number;
  date: string;
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
}

export interface UpdateSessionExerciseDto {
  sets: WorkoutSet[];
  notes: string;
}


export interface UpdateWorkoutSessionExerciseDto {
  exerciseId: number;
  sets: WorkoutSet[];
  order: number;
  notes: string;
}