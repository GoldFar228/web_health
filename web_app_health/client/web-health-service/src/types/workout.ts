// /src/types/workout.ts

// ✅ WorkoutStatus как union type (вместо enum)
export type WorkoutStatus = 0 | 1 | 2 | 3;

// ✅ Константы для удобного использования
export const WorkoutStatusValue = {
  Planned: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3
} as const;

// ✅ Helper функция для получения названия статуса
export const getWorkoutStatusLabel = (status: WorkoutStatus): string => {
  switch (status) {
    case 0: return 'Запланирована';
    case 1: return 'В процессе';
    case 2: return 'Завершена';
    case 3: return 'Отменена';
    default: return 'Неизвестно';
  }
};

// ✅ Helper функция для получения CSS класса статуса
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

// ✅ Локальное упражнение (из твоей БД)
export interface Exercise {
  id: number;              // Локальный ID (для WorkoutSessionExercise)
  wgerExerciseId: number;  // ID из Wger API
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

export interface UpdateExerciseDto {
  wgerExerciseId?: number;
  name: string;
  description?: string;
  category?: string;
  muscleGroup?: string;
  imageUrl?: string;
}

// ✅ Ответ от batch добавления
export interface BatchExerciseResult {
  totalProcessed: number;
  added: number;
  skipped: number;
  exercises: Exercise[];
}

// ✅ Упражнение из Wger API (поиск)
export interface WgerExercise {
  id: number;              // Wger ID
  uuid?: string;
  name?: string;
  exerciseName?: string;   // Обогащённое имя
  description?: string;
  category?: number;
  muscles?: number[];
  musclesSecondary?: number[];
  equipment?: number[];
  language?: number;
  licenseAuthor?: string;
  created?: string;
  lastUpdate?: string;
}

// ✅ Ответ от Wger API (список упражнений)
export interface WgerExerciseListDto {
  count: number;
  next?: string;
  previous?: string;
  results: WgerExercise[];
}

// ✅ Детальная информация об упражнении из Wger
export interface WgerExerciseInfoDto {
  id: number;
  uuid?: string;
  name?: string;
  description?: string;
  category?: WgerCategoryInfoDto;
  muscles?: WgerMuscleInfoDto[];
  musclesSecondary?: WgerMuscleInfoDto[];
  equipment?: WgerEquipmentInfoDto[];
  translations?: WgerTranslationDto[];
}

export interface WgerCategoryInfoDto {
  id: number;
  name?: string;
}

export interface WgerMuscleInfoDto {
  id: number;
  name?: string;
  nameEn?: string;
  isFront?: boolean;
  imageUrlMain?: string;
}

export interface WgerEquipmentInfoDto {
  id: number;
  name?: string;
}

export interface WgerTranslationDto {
  id: number;
  uuid?: string;
  name?: string;
  description?: string;
  language: number;
}

// ============================================
// Тренировочные сессии
// ============================================

// ✅ Один сет (подход) - для UI
export interface WorkoutSet {
  id?: number;
  order: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}
// ✅ Упражнение в рамках тренировочной сессии
export interface WorkoutSessionExercise {
  id?: number;                    // ID записи в БД (если сохранено)
  exerciseId: number;             // Локальный ID упражнения
  exerciseName?: string;          // Кэш названия (для отображения)
  muscleGroup?: string;           // Кэш группы мышц
  plannedSets?: number;           // Плановое количество подходов
  plannedReps?: number;           // Плановое количество повторений
  plannedWeightKg?: number;       // Плановый вес (кг)
  sets: WorkoutSet[]
  actualSets: number;             // Фактическое количество подходов
  actualReps: number;             // Фактическое количество повторений
  actualWeightKg?: number;        // Фактический вес (кг)
  order: number;                  // Порядок упражнения в тренировке
  notes: string;                  // Заметки к упражнению
}

// ✅ Тренировочная сессия (запись о тренировке)
export interface WorkoutSession {
  id?: number;
  clientId?: number;
  date: string;                   // ISO 8601 формат
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
  exercises: WorkoutSessionExercise[];
  trainingProgramId?: number;     // Если всё же решишь добавить связь
  trainingProgramName?: string;
}

// ============================================
// DTO для API запросов
// ============================================

// ✅ Создание новой тренировочной сессии
export interface CreateWorkoutSessionDto {
  date: string;
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
  exercises: CreateWorkoutSessionExerciseDto[];
}

// ✅ Упражнение для создания сессии
export interface CreateWorkoutSessionExerciseDto {
  exerciseId: number;
  // plannedSets?: number;
  // plannedReps?: number;
  // plannedWeightKg?: number;
  actualSets: number;
  actualReps: number;
  actualWeightKg?: number;
  order: number;
  notes: string;
}

// ✅ Обновление тренировочной сессии
export interface UpdateWorkoutSessionDto {
  id: number;
  date: string;
  durationMinutes: number;
  notes: string;
  status: WorkoutStatus;
}

// ✅ Обновление упражнения в сессии
export interface UpdateSessionExerciseDto {
  actualSets: number;
  actualReps: number;
  actualWeightKg?: number;
  notes: string;
}

// ============================================
// Ответы API
// ============================================

// ✅ Ответ при сохранении упражнения в БД
export interface SaveExerciseResponse {
  message: string;
  localId: number;
  wgerId: number;
  name: string;
  category?: string;
  muscleGroup?: string;
}

// ✅ Ответ при синхронизации упражнений
export interface SyncExercisesResponse {
  message: string;
  added?: number;
  updated?: number;
  total: number;
  exercises: Array<{
    localId: number;
    wgerId: number;
    name: string;
    category?: string;
  }>;
}

