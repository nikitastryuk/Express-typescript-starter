import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { DocumentationRouter } from './components/documentation/documentation.route';
import { InfoRouter } from './components/info/info.route';
import { ApiError, ErrorResponse } from './util/error';

export class ExpressServer {
  private _application: express.Application;
  private _server: http.Server;

  constructor() {
    this._application = express();
    this.init();
  }

  public start() {
    return new Promise(resolve => {
      this._server = this._application.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
        resolve();
      });
    });
  }

  public async stop() {
    // Close db connection
    await mongoose.connection.close();
    return new Promise(resolve => {
      this._server.close(() => {
        resolve();
      });
    });
  }

  private init() {
    // Middlewares
    this.initDefaultMiddlewares();
    // Routes
    this.initRoutes();
    // Error-handling middlewaremust be last middleware
    this._application.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      return res.status(err.statusCode).send(err.message);
    });
  }

  private initDefaultMiddlewares() {
    // Http headers security
    this._application.use(helmet());
    // Enable cors requests
    this._application.use(cors());
    // Json body parser
    this._application.use(bodyParser.json());
    // Compress response
    this._application.use(compression());
    // Logger
    this._application.use(morgan('dev'));
  }

  private initRoutes() {
    this._application.use(InfoRouter());
    // Swagger
    this._application.use(DocumentationRouter());
    // 404
    this._application.use((_req: express.Request, _res: express.Response, next: express.NextFunction) => {
      next(new ApiError(ErrorResponse.WrongEndpoint));
    });
  }
}
