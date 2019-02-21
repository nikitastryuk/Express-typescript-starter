import http from 'http';

import { connectToDatabase, disconnectFromDatabase } from './database';
import { ExpressApplication } from './express.application';

let server: http.Server;

export async function startServer(): Promise<http.Server> {
  // Connect to db
  await connectToDatabase();
  const expressApplication = new ExpressApplication().application;
  return new Promise(resolve => {
    server = expressApplication.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT} (${process.env.NODE_ENV})`);
      resolve(server);
    });
  });
}

export async function stopServer() {
  // Disconnect from db
  await disconnectFromDatabase();
  return new Promise(resolve => {
    server.close(() => {
      resolve();
    });
  });
}
