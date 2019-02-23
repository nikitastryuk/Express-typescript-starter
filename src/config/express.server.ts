import http from 'http';

import { startRedisConnection, stopRedisConnection } from './cache';
import { connectToDatabase, disconnectFromDatabase } from './database';
import { ExpressApplication } from './express.application';

let server: http.Server;

export async function startServer(): Promise<http.Server> {
  // Connect to db
  await connectToDatabase();
  // Setup caching
  startRedisConnection();
  const expressApplication = new ExpressApplication().application;
  return new Promise(resolve => {
    server = expressApplication.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT} (${process.env.NODE_ENV})`);
      resolve(server);
    });
  });
}

export async function stopServer() {
  await disconnectFromDatabase();
  stopRedisConnection();
  return new Promise(resolve => {
    server.close(() => {
      console.log('Server stopped');
      resolve();
    });
  });
}
