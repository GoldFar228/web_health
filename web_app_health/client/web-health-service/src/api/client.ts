import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: 'https://localhost:7073/api', // ваш базовый URL
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
  }
});

// Интерцептор для автоматической подстановки токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Автоматический логаут при 401
      localStorage.removeItem('token');
      window.location.href = '/auth/login'; // или другой путь
    }
    return Promise.reject(error);
  }
);

export default apiClient;