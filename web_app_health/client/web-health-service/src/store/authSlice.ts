// src/store/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Client } from '../types';

interface AuthState {
  token: string | null;
  profile: Client | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  profile: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Вызывается при начале логина
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    // Успешный логин
    loginSuccess(state, action: PayloadAction<{ token: string; profile: Client }>) {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
      state.isLoading = false;
      localStorage.setItem('token', token);
      // localStorage.setItem('profile', JSON.stringify(profile));
    },
    // Ошибка логина
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Выход из аккаунта
    logout(state) {
      state.token = null;
      state.profile = null;
      state.error = null;
      localStorage.removeItem('token');
      // localStorage.removeItem('profile');
      
      // Вызываем событие storage для синхронизации вкладок
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        oldValue: localStorage.getItem('token'),
        newValue: null
      }));
    },
    setProfile: (state, action: PayloadAction<Client>) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    // Обновление профиля (например, после редактирования)
    updateProfile(state, action: PayloadAction<Partial<Client>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        // localStorage.setItem('profile', JSON.stringify(state.profile));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile, setProfile } = authSlice.actions;
export default authSlice.reducer;