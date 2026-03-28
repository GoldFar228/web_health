// /src/utils/jwtUtils.ts

// ✅ Проверка истечения токена
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return false;  // Если нет exp — считаем валидным
    
    // Exp в секундах, Date.now() в миллисекундах
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// ✅ Получить Id пользователя из токена
export const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] 
           || payload['sub'] 
           || payload['id']
           || null;
  } catch {
    return null;
  }
};