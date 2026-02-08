/**
 * Декодирует payload из JWT-токена (без проверки подписи!)
 */
export const decodeJwt = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1]; // payload — вторая часть
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.warn('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Проверяет, истёк ли срок действия токена
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) {
    return true; // если нет exp — считаем токен недействительным
  }

  const currentTime = Math.floor(Date.now() / 1000); // текущее время в секундах
  return decoded.exp < currentTime;
};