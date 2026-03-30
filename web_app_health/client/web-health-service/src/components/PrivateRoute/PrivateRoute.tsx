// PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/jwtUtils';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface Props {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.token !== null);
  const hasToken = !!localStorage.getItem('token');

  // ✅ Проверяем и Redux state, и localStorage
  if (!isAuthenticated || !hasToken) {
    return <Navigate to="/Auth/Login" replace />;
  }

  return <>{children}</>;
};