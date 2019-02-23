import dotenv from 'dotenv';
dotenv.config();

import { disconnectFromDatabase } from './config/database';
import { startServer } from './config/express.server';
import { checkEnv } from './helpers/helpers';

(async () => {
  try {
    // Check process.env variables before starting the server
    checkEnv(['PORT', 'NAME', 'NODE_ENV', 'DB_URL', 'DB_LOCAL_URL', 'REDIS_URL']);
    await startServer();
  } catch (error) {
    console.log(error.message);
  }
})();

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  console.error('Unhandled Promise Rejection:', error.message);
  process.exit(1);
});

process.on('SIGINT', async () => {
  // Disconnect from db
  await disconnectFromDatabase();
  console.log('Mongoose connection is disconnected due to application termination');
  process.exit();
});
