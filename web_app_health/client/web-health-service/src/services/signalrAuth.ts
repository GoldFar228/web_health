// src/services/signalrAuth.ts
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

let connection: HubConnection | null = null;

export const startAuthConnection = (token: string): HubConnection => {
  if (connection?.state === 'Connected') return connection;

  // Закрываем старое соединение, если оно есть
  if (connection) {
    connection.stop();
  }

  connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7073/hubs/auth', {
      accessTokenFactory: () => token, // ← ключевой момент!
    })
    .configureLogging(LogLevel.Information)
    .build();

  return connection;
};

export const stopAuthConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
  }
};


