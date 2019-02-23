import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import httpStatus from 'http-status';
import supertest from 'supertest';

import { startServer, stopServer } from '../../config/express.server';

let server: http.Server;

describe('Info', () => {
  beforeAll(async () => {
    server = await startServer();
  });
  describe('GET', () => {
    describe('/', () => {
      it('should get server status information', async () => {
        const response = await supertest(server).get('');
        expect(response.status).toBe(httpStatus.OK);
        expect(Object.keys(response.body)).toEqual(expect.arrayContaining(['name', 'serverDateTime']));
      });
    });
  });
  afterAll(async () => {
    await stopServer();
  });
});
