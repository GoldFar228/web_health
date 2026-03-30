// /src/store/authSlice.ts

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
    loginStart(state) {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess(state, action: PayloadAction<{ token: string; profile: Client }>) {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
      state.isLoading = false;
      localStorage.setItem('token', token);
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // ✅ ЧИСТЫЙ REDUCER (без side effects)
    logout(state) {
      state.token = null;
      state.profile = null;
      state.error = null;
      localStorage.removeItem('token');  // ✅ Это работает

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

    updateProfile(state, action: PayloadAction<Partial<Client>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile, setProfile } = authSlice.actions;
export default authSlice.reducer;