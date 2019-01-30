import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

import { initDatabase } from './database';
import { ExpressServer } from './server';
(async () => {
  try {
    // Check environment variables
    if (!process.env.PORT) {
      throw new Error('PORT environment variable must be defined');
    }
    if (!process.env.NAME) {
      throw new Error('NAME environment variable must be defined');
    }
    if (!process.env.NODE_ENV) {
      throw new Error('NODE_ENV environment variable must be defined');
    }
    // Initialize database
    await initDatabase();
    // Start server
    const server = new ExpressServer();
    await server.start();
    // await server.stop();
  } catch (error) {
    console.log(error);
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
  await mongoose.connection.close();
  console.log('Mongoose connection is disconnected due to application termination');
  process.exit();
});
