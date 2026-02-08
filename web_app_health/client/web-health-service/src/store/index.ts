import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const loadState = () => {
  try {
    const token = localStorage.getItem('token');
    const profileStr = localStorage.getItem('profile');

    // Проверяем, что profile — валидный JSON
    const profile = profileStr ? JSON.parse(profileStr) : null;

    return {
      auth: {
        token,
        profile,
        isLoading: false,
        error: null,
      }
    };
  } catch (err) {
    console.warn('Failed to load state from localStorage', err);
    return undefined; // Redux проигнорирует undefined и использует initialState
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});


// Типизация для useSelector и useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;