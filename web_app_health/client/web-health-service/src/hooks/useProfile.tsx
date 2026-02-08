
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setProfile, logout } from '../store/authSlice';
import apiClient from '../api/client';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.auth);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Загрузка профиля текущего пользователя
  const loadMyProfile = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch(logout());
      return null;
    }

    try {

      const response = await apiClient.get('/Client/GetMyProfile/me');

      // Сохраняем профиль в Redux
      dispatch(setProfile(response.data));

      return response.data;
    } catch (error: any) {
      console.error('Ошибка загрузки профиля:', error);

      // Если ошибка 401 (Unauthorized) - токен невалидный
      if (error.response?.status === 401) {
        console.log('Токен невалиден, выполняем логаут');
        dispatch(logout());
      }

      return null;
    }
  }, [dispatch]);

  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && !profile) {
      console.log('Загружаю профиль...');
      loadMyProfile();
    }

    // Только при монтировании и изменении profile
  }, []); // Убрали зависимость loadMyProfile и profile

  return {
    profile,
    isLoading: !profile && !!localStorage.getItem('token'),
    loadMyProfile,
    isAuthenticated: !!profile && !!localStorage.getItem('token'),
  };
  // Автоматическая загрузка при монтировании
  // useEffect(() => {
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === 'token' && !e.newValue) {
  //       // Токен удален - принудительный ререндер
  //       setForceUpdate(prev => prev + 1);
  //       dispatch(logout());
  //     }
  //   };

  //   window.addEventListener('storage', handleStorageChange);

  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, [dispatch]);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (!token && profile) {
  //     // Если нет токена, но есть профиль - очищаем
  //     dispatch(logout());
  //   }
  // });
  // return {
  //   profile,
  //   isLoading: !profile && !!localStorage.getItem('token'),
  //   loadMyProfile,
  //   isAuthenticated: !!profile && !!localStorage.getItem('token'),
  //   forceUpdate,
  // };
};