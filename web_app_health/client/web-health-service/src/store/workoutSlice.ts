// /src/store/slices/workoutSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { workoutApi } from '../services/workoutApi';
import type { 
  WorkoutSession, 
  Exercise, 
  CreateWorkoutSessionDto, 
  WorkoutStatus,
  WorkoutSet
} from '../types/workout';

interface WorkoutState {
  sessions: WorkoutSession[];
  localExercises: Exercise[];
  currentSession: WorkoutSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  sessions: [],
  localExercises: [],
  currentSession: null,
  loading: false,
  error: null
};

// 🔄 Async Thunks
export const fetchAllSessions = createAsyncThunk(
  'workout/fetchAllSessions',
  async (_, { rejectWithValue }) => {
    try {
      return await workoutApi.getAllSessions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

export const fetchLocalExercises = createAsyncThunk(
  'workout/fetchLocalExercises',
  async (_, { rejectWithValue }) => {
    try {
      return await workoutApi.getLocalExercises();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch exercises');
    }
  }
);

export const createWorkoutSession = createAsyncThunk(
  'workout/createSession',
  async (dto: CreateWorkoutSessionDto, { rejectWithValue }) => {
    try {
      return await workoutApi.createSession(dto);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create session');
    }
  }
);

export const deleteWorkoutSession = createAsyncThunk(
  'workout/deleteSession',
  async (id: number, { rejectWithValue }) => {
    try {
      await workoutApi.deleteSession(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete session');
    }
  }
);

// ✅ Helper для пересчёта фактических значений
function recalculateActuals(exercise: any) {
  const completedSets = exercise.sets.filter((s: WorkoutSet) => s.completed);
  exercise.actualSets = completedSets.length;
  exercise.actualReps = completedSets.reduce((sum: number, s: WorkoutSet) => sum + s.reps, 0);
  exercise.actualWeightKg = completedSets.length > 0 
    ? Math.round(completedSets.reduce((sum: number, s: WorkoutSet) => sum + s.weightKg, 0) / completedSets.length * 10) / 10
    : 0;
}

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<WorkoutSession | null>) => {
      state.currentSession = action.payload;
    },
    
    addExerciseToSession: (state, action: PayloadAction<Exercise>) => {
      const defaultSets: WorkoutSet[] = [
        { order: 0, reps: 10, weightKg: 0, completed: false },
        { order: 1, reps: 10, weightKg: 0, completed: false },
        { order: 2, reps: 10, weightKg: 0, completed: false }
      ];
      
      if (state.currentSession) {
        state.currentSession.exercises.push({
          exerciseId: action.payload.id,
          exerciseName: action.payload.name,
          muscleGroup: action.payload.muscleGroup,
          sets: defaultSets,
          actualSets: 0,
          actualReps: 0,
          actualWeightKg: 0,
          order: state.currentSession.exercises.length,
          notes: ''
        });
      } else {
        state.currentSession = {
          date: new Date().toISOString(),
          durationMinutes: 60,
          notes: '',
          status: 0 as WorkoutStatus,
          exercises: [{
            exerciseId: action.payload.id,
            exerciseName: action.payload.name,
            muscleGroup: action.payload.muscleGroup,
            sets: defaultSets,
            actualSets: 0,
            actualReps: 0,
            actualWeightKg: 0,
            order: 0,
            notes: ''
          }]
        };
      }
    },
    
    removeExerciseFromSession: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.exercises = state.currentSession.exercises.filter(
          (_, index) => index !== action.payload
        );
      }
    },
    
    // ✅ ДОБАВЛЕНО: Обновление упражнения
    updateExerciseInSession: (state, action: PayloadAction<{
      index: number;
      field: string;
      value: any;
    }>) => {
      if (state.currentSession) {
        const exercise = state.currentSession.exercises[action.payload.index];
        if (exercise) {
          (exercise as any)[action.payload.field] = action.payload.value;
        }
      }
    },
    
    // ✅ Обновление сета
    updateSetInExercise: (state, action: PayloadAction<{
      exerciseIndex: number;
      setIndex: number;
      field: keyof WorkoutSet;
      value: any;
    }>) => {
      if (state.currentSession) {
        const exercise = state.currentSession.exercises[action.payload.exerciseIndex];
        if (exercise?.sets[action.payload.setIndex]) {
          (exercise.sets[action.payload.setIndex] as any)[action.payload.field] = action.payload.value;
          recalculateActuals(exercise);
        }
      }
    },
    
    // ✅ ДОБАВЛЕНО: Добавить сет
    addSetToExercise: (state, action: PayloadAction<{ exerciseIndex: number }>) => {
      if (state.currentSession) {
        const exercise = state.currentSession.exercises[action.payload.exerciseIndex];
        if (exercise) {
          const lastSet = exercise.sets[exercise.sets.length - 1];
          exercise.sets.push({
            order: exercise.sets.length,
            reps: lastSet?.reps || 10,
            weightKg: lastSet?.weightKg || 0,
            completed: false
          });
          recalculateActuals(exercise);
        }
      }
    },
    
    // ✅ ДОБАВЛЕНО: Удалить сет
    removeSetFromExercise: (state, action: PayloadAction<{
      exerciseIndex: number;
      setIndex: number;
    }>) => {
      if (state.currentSession) {
        const exercise = state.currentSession.exercises[action.payload.exerciseIndex];
        if (exercise?.sets.length > 1) {
          exercise.sets.splice(action.payload.setIndex, 1);
          exercise.sets.forEach((set, idx) => set.order = idx);
          recalculateActuals(exercise);
        }
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },

    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSessions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllSessions.fulfilled, (state, action) => { state.loading = false; state.sessions = action.payload; })
      .addCase(fetchAllSessions.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchLocalExercises.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLocalExercises.fulfilled, (state, action) => { state.loading = false; state.localExercises = action.payload; })
      .addCase(fetchLocalExercises.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createWorkoutSession.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createWorkoutSession.fulfilled, (state, action) => { state.loading = false; state.sessions.unshift(action.payload); state.currentSession = null; })
      .addCase(createWorkoutSession.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(deleteWorkoutSession.fulfilled, (state, action) => { state.sessions = state.sessions.filter(s => s.id !== action.payload); });
  }
});

// ✅ Теперь все экспорты соответствуют редюсерам
export const {
  setCurrentSession,
  addExerciseToSession,
  removeExerciseFromSession,
  updateExerciseInSession,      // ✅ Теперь есть в reducers
  updateSetInExercise,
  addSetToExercise,             // ✅ Теперь есть в reducers
  removeSetFromExercise,        // ✅ Теперь есть в reducers
  clearCurrentSession,
  clearError
} = workoutSlice.actions;

export default workoutSlice.reducer;