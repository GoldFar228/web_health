// /src/hooks/useAuthSync.ts

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

export const useAuthSync = () => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem('token');
      
      if (!hasToken && isAuthenticated) {
        setIsAuthenticated(false);
        dispatch(logout());
      } else if (hasToken && !isAuthenticated) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    
    const handleFocus = () => {
      checkAuth();
    };
    
    const interval = setInterval(checkAuth, 2000);
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch, isAuthenticated]);

  return isAuthenticated;
};