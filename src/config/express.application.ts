import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { DocumentationRouter } from '../components/documentation/documentation.route';
import { InfoRouter } from '../components/info/info.route';
import { UserRouter } from '../components/user/user.route';
import { ApiError, ErrorResponse } from '../helpers/error';

export class ExpressApplication {
  public application: express.Application;

  constructor() {
    this.application = express();
    // Middlewares
    this.configureDefaultMiddlewares();
    // Routes
    this.configureRoutes();
    // Error-handling must be last
    this.configureErrorHandler();
  }

  private configureDefaultMiddlewares() {
    // Http headers security
    this.application.use(helmet());
    // Enable cors requests
    this.application.use(cors());
    // Json body parser
    this.application.use(bodyParser.json());
    // Compress response
    this.application.use(compression());
    // Logger
    if (process.env.NODE_ENV === 'dev') {
      this.application.use(morgan('dev'));
    }
  }

  private configureRoutes() {
    this.application.use('/', InfoRouter());
    // Swagger
    this.application.use('/api-docs', DocumentationRouter());
    this.application.use('/user', UserRouter());
    // 404
    this.application.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
      next(new ApiError(ErrorResponse.WrongEndpoint));
    });
  }

  private configureErrorHandler() {
    // TODO: err type
    this.application.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      return res.status(err.statusCode).send(err.message);
    });
  }
}
