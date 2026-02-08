// src/hooks/useAuthSignalR.ts
import { useEffect } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { isTokenExpired } from '../utils/jwtUtils';

let connection: HubConnection | null = null;

export const useAuthSignalR = (onLogout: () => void) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      onLogout();
      return;
    }

    // Создаём подключение к SignalR
    connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7073/hubs/auth?access_token=${encodeURIComponent(token)}`)
      .configureLogging(LogLevel.Trace)
      .build();

    // Подключаемся
    connection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch((err) => {
        console.error('❌ SignalR connection failed:', err);
        onLogout(); // если не подключились — выходим
      });

    // Опционально: слушаем принудительный logout от сервера
    connection.on('Logout', (reason: string) => {
      console.log('🚪 Forced logout from server:', reason);
      onLogout();
    });

    // Очистка при размонтировании
    return () => {
      if (connection?.state === 'Connected') {
        connection.stop();
      }
    };
  }, [onLogout]);
};