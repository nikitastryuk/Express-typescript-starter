import dotenv from 'dotenv';
dotenv.config();
import httpStatus from 'http-status';
import supertest from 'supertest';

import { startServer, stopServer } from '../../config/express.server';

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Info', () => {
  beforeAll(async () => {
    await startServer();
  });
  describe('GET', () => {
    describe('/', () => {
      it('should get server status information', async () => {
        const response = await supertest(apiUrl).get('');
        expect(response.status).toBe(httpStatus.OK);
        expect(Object.keys(response.body)).toEqual(expect.arrayContaining(['name', 'serverDateTime']));
      });
    });
  });
  afterAll(async () => {
    await stopServer();
  });
});
