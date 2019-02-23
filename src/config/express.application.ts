import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import morgan from 'morgan';
import rotatingFileStream from 'rotating-file-stream';
import { DocumentationRouter } from '../components/documentation/documentation.route';
import { InfoRouter } from '../components/info/info.route';
import { UserRouter } from '../components/user/user.route';
import { ApiError, ErrorResponse, isApiError } from '../helpers/error';

export class ExpressApplication {
  public application: express.Application;

  constructor() {
    this.application = express();
    // Middlewares
    this.configureDefaultMiddlewares();
    // Routes
    this.configureRoutes();
    // Error-handling must be last
    this.configureErrorHandlers();
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
    this.application.use('/users', UserRouter());
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
