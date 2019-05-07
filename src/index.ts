import dotenv from 'dotenv';
dotenv.config();
import { UserController } from './components/user/user.controller';
import { UserRepository } from './components/user/user.repo';
import { IServerDependencies, Server } from './config/server';
import { checkEnv } from './helpers';

(async () => {
  try {
    // Check process.env variables before starting the server
    checkEnv(['PORT', 'NAME', 'NODE_ENV', 'DB_URL', 'DB_LOCAL_URL']);

    const userRepository = new UserRepository();
    const userController = new UserController(userRepository);

    const dependencies: IServerDependencies = { userController };

    const server = new Server(dependencies);

    await server.start();
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
