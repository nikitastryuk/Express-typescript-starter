import dotenv from 'dotenv';
dotenv.config();
import httpStatus from 'http-status';
import supertest from 'supertest';

import { Server } from '../../config/server';
import { UserController } from '../user/user.controller';
import { UserRepository } from '../user/user.repo';

// TODO: Mock User repo and controller
const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const server = new Server({ userController });

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('Info', () => {
  beforeAll(async () => {
    await server.start();
  });
  afterAll(async () => {
    await server.stop();
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
});
