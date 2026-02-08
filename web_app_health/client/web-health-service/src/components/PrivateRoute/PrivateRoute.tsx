// PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../../utils/jwtUtils';

export const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); 
    return <Navigate to="/Auth/Login" replace />;
  }
  return children;
};