// /src/hooks/useAuthSignalR.ts

import { useEffect } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { isTokenExpired } from '../utils/jwtUtils';

let connection: HubConnection | null = null;

export const useAuthSignalR = (onLogout: () => void) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log('🔑 [SignalR] Token:', token ? '***' + token.slice(-10) : 'NONE');
    
    if (!token || isTokenExpired(token)) {
      console.log('❌ [SignalR] No valid token, skipping connection');
      return;
    }

    // Создаём подключение к SignalR
    connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7073/hubs/auth?access_token=${encodeURIComponent(token)}`)
      .configureLogging(LogLevel.Information)
      .build();

    // Подключаемся
    connection
      .start()
      .then(() => console.log('✅ [SignalR] Connected successfully'))
      .catch((err) => {
        console.error('❌ [SignalR] Connection failed:', err);
      });

    // Слушаем принудительный logout от сервера
    connection.on('Logout', (reason: string) => {
      console.log('🚪 [SignalR] Forced logout from server:', reason);
      onLogout();
    });

    // Heartbeat для проверки соединения
    const heartbeatInterval = setInterval(() => {
      if (connection?.state === 'Connected') {
        console.log('💓 [SignalR] Connection alive');
      }
    }, 5000);

    // Очистка при размонтировании
    return () => {
      console.log('🧹 [SignalR] Cleaning up connection');
      clearInterval(heartbeatInterval);
      if (connection?.state === 'Connected') {
        connection.stop();
      }
      connection = null;
    };
  }, [onLogout]);
};