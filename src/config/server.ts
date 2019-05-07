import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import httpStatus from 'http-status';
import morgan from 'morgan';
import rotatingFileStream from 'rotating-file-stream';
import { DocumentationRouter } from '../components/documentation/documentation.route';
import { InfoRouter } from '../components/info/info.route';
import { IUserController } from '../components/user/user.controller';
import { UserRouter } from '../components/user/user.route';
import { ApiError, ErrorResponse, isApiError } from '../helpers/error';
import { startRedisConnection, stopRedisConnection } from './cache';
import { connectToDatabase, disconnectFromDatabase } from './database';

export interface IServerDependencies {
  userController: IUserController;
}

export class Server {
  private application: express.Application;
  private server: http.Server;
  private dependencies: IServerDependencies;

  constructor(dependencies: IServerDependencies) {
    this.application = express();
    this.dependencies = dependencies;
    // Middlewares
    this.configureDefaultMiddlewares();
    // Routes
    this.configureRoutes();
    // Error-handling must be last
    this.configureErrorHandlers();
  }

  public async start(): Promise<http.Server> {
    // Connect to db
    await connectToDatabase();
    // Setup caching
    startRedisConnection();
    return new Promise(resolve => {
      this.server = this.application.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT} (${process.env.NODE_ENV})`);
        resolve(this.server);
      });
    });
  }

  public async stop() {
    await disconnectFromDatabase();
    stopRedisConnection();
    return new Promise(resolve => {
      this.server.close(() => {
        console.log('Server stopped');
        resolve();
      });
    });
  }

  private configureDefaultMiddlewares() {
    // Http headers security
    this.application.use(helmet());
    // Enable cors requests
    this.application.use(cors());
    // Json body parser
    this.application.use(bodyParser.json());
    // TODO: Cloud service will handle this
    // Compress response
    this.application.use(compression());
    // TODO: Replace with logging service
    // File logger
    const accessLogStream = rotatingFileStream('access.log', {
      interval: '1d',
      path: 'log',
    });
    this.application.use(
      morgan(':status ":method :url" [:date[web]] ":user-agent"  :response-time ms', {
        stream: accessLogStream,
        skip(_req, res) {
          return res.statusCode < 404;
        },
      }),
    );
    // Terminal logger
    if (process.env.NODE_ENV === 'dev') {
      this.application.use(morgan('dev'));
    }
  }

  private configureRoutes() {
    this.application.use('/', InfoRouter());
    // Swagger
    this.application.use('/api-docs', DocumentationRouter());

    this.application.use('/users', UserRouter(this.dependencies.userController));
    // 404
    this.application.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
      next(new ApiError(ErrorResponse.WrongEndpoint));
    });
  }

  private configureErrorHandlers() {
    // Celebrate error handler
    this.application.use(errors());
    // Default error handler
    this.application.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      // Api errors
      if (isApiError(err)) return res.status(err.statusCode).json({ statusCode: err.statusCode, message: err.message });
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ statusCode: httpStatus.INTERNAL_SERVER_ERROR, message: err.message });
    });
  }
}
