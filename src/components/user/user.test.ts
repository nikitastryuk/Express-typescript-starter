import dotenv from 'dotenv';
dotenv.config();
import httpStatus from 'http-status';
import supertest from 'supertest';

import { startServer, stopServer } from '../../config/express.server';
import { User } from './user.model';

const getRandomExistingUserId = async () => {
  const response = await supertest(apiUrl).get(`?offset=0&limit=${testUsers.length}`);
  return response.body.users[0]._id;
};

const apiUrl = `http://localhost:${process.env.PORT}/users`;
const testUsers = [
  {
    firstName: 'firstUserFN',
    lastName: 'firstUserLN',
    location: {
      coordinates: [1, 1],
      name: 'firstUserLocationName',
    },
  },
  {
    firstName: 'secondUserFN',
    lastName: 'secondUserLN',
    location: {
      coordinates: [2, 2],
      name: 'secondUserLocationName',
    },
  },
  {
    firstName: 'thirdUserFN',
    lastName: 'thirdUserLN',
    location: {
      coordinates: [3, 3],
      name: 'thirdUserLocationName',
    },
  },
];

describe('Users', () => {
  beforeAll(async () => {
    await startServer();
  });
  beforeEach(async () => {
    await User.deleteMany({});
    await User.create(testUsers);
  });
  describe('GET', () => {
    describe('/users', () => {
      it('should fail without "offset", "limit" query values', async () => {
        const response = await supertest(apiUrl).get('');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it(`?offset=0&limit=${testUsers.length} should return all users`, async () => {
        const response = await supertest(apiUrl).get('?offset=0&limit=3');
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.users).toHaveLength(testUsers.length);
        expect(response.body.totalCount).toBe(testUsers.length);
      });
      it(`?offset=${testUsers.length - 1}&limit=${testUsers.length} should return last user`, async () => {
        const response = await supertest(apiUrl).get(`?offset=${testUsers.length - 1}&limit=${testUsers.length}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.users).toHaveLength(1);
        expect(response.body.totalCount).toBe(testUsers.length);
        expect(response.body.users[0].firstName).toBe(testUsers[testUsers.length - 1].firstName);
      });
      it(`?offset=${testUsers.length}&limit=${testUsers.length} should return empty array`, async () => {
        const response = await supertest(apiUrl).get(`?offset=${testUsers.length}&limit=${testUsers.length}`);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.users).toHaveLength(0);
        expect(response.body.totalCount).toBe(testUsers.length);
      });
      it('?sort=wrongField&offset=0&limit=3 should fail with invalid "sort" query value', async () => {
        const response = await supertest(apiUrl).get('?sort=wrongField&offset=0&limit=3');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('?sort=location&offset=0&limit=3 should fail without "lat", "lng" query values', async () => {
        const response = await supertest(apiUrl).get('?sort=location&offset=0&limit=3');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('?sort=location&lat=0&lng=0&offset=0&limit=3 should return all users enriched with distance field', async () => {
        const response = await supertest(apiUrl).get('?sort=location&lat=0&lng=0&offset=0&limit=3');
        expect(response.status).toBe(httpStatus.OK);
        // Every user should have distance field
        response.body.users.map((user: any) =>
          expect(user).toMatchObject({
            distance: expect.any(Number),
          }),
        );
      });
    });
    describe('/users/:{id}', () => {
      it('should fail for if {id} is invalid objectId type', async () => {
        const response = await supertest(apiUrl).get(`/${'randomString'}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('should be 404 for not existing {id}', async () => {
        const notExistingId = '5c6dc84f8585c80846da71ea';
        const response = await supertest(apiUrl).get(`/${notExistingId}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
      it('should return a user for existing {id]', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl).get(`/${existingId}`);
        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });

  describe('POST', () => {
    describe('/users', () => {
      const newUser = {
        firstName: 'fourthUserFN',
        lastName: 'fourthUserLN',
        location: {
          coordinates: [1, 1],
          name: 'fourthUserLocationName',
        },
      };
      it('should create a user with valid body', async () => {
        const response = await supertest(apiUrl)
          .post('')
          .send(newUser);
        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body.firstName).toBe(newUser.firstName);
      });
      it('should fail to create a user with missing required body fields', async () => {
        const response = await supertest(apiUrl)
          .post('')
          .send({
            firstName: 'fourthUserFN',
          });
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('should fail to create a user with missing required body.location fields', async () => {
        const response = await supertest(apiUrl)
          .post('')
          .send({
            ...newUser,
            location: {
              coordinates: [1, 1],
            },
          });
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('should fail to create a user with invalid body.location.coordinates format', async () => {
        const response = await supertest(apiUrl)
          .post('')
          .send({
            ...newUser,
            location: {
              coordinates: [1, 'string'],
              name: 'fourthUserLocationName',
            },
          });
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    });
  });

  describe('PUT', () => {
    describe('/users', () => {
      const updatedUser = {
        firstName: 'updatedUserFN',
        lastName: 'updatedUserLN',
        location: {
          coordinates: [4, 3],
          name: 'updatedUserLocationName',
        },
      };
      it('should update user with valid body', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl)
          .put(`/${existingId}`)
          .send({
            ...updatedUser,
          });
        const { firstName, lastName, location } = updatedUser;
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.firstName).toBe(firstName);
        expect(response.body.lastName).toBe(lastName);
        expect(response.body.location.coordinates).toEqual(location.coordinates);
      });
      it('should update just name with valid body', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl)
          .put(`/${existingId}`)
          .send({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
          });
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.firstName).toBe(updatedUser.firstName);
        expect(response.body.lastName).toBe(updatedUser.lastName);
      });
      it('should to update just location with valid body', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl)
          .put(`/${existingId}`)
          .send({
            location: updatedUser.location,
          });
        expect(response.status).toBe(httpStatus.OK);
        const { coordinates, name } = updatedUser.location;
        expect(response.body.location.coordinates).toEqual(coordinates);
        expect(response.body.location.name).toBe(name);
      });
      it('should fail to update user location with missing required body.location fields', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl)
          .put(`/${existingId}`)
          .send({
            ...updatedUser,
            location: {
              coordinates: [1, 1],
            },
          });
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('should fail to update user location with invalid body.location.coordinates format', async () => {
        const existingId = await getRandomExistingUserId();
        const response = await supertest(apiUrl)
          .put(`/${existingId}`)
          .send({
            ...updatedUser,
            location: {
              coordinates: [1, 'string'],
              name: 'fourthUserLocationName',
            },
          });
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    });
  });

  describe('DELETE', () => {
    describe('/users/:{id}', () => {
      it('should fail for if {id} is invalid objectId type', async () => {
        const response = await supertest(apiUrl).delete(`/${'randomString'}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
      it('should be 200 for not existing {id}', async () => {
        const notExistingId = '5c6dc84f8585c80846da71ea';
        const response = await supertest(apiUrl).delete(`/${notExistingId}`);
        expect(response.status).toBe(httpStatus.OK);
      });
      it('should delete a user for existing {id]', async () => {
        const existingId = await getRandomExistingUserId();
        {
          const response = await supertest(apiUrl).delete(`/${existingId}`);
          expect(response.status).toBe(httpStatus.OK);
        }
        // Expect user to not exist anymore
        const response = await supertest(apiUrl).get(`/${existingId}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    });
  });

  afterAll(async () => {
    await stopServer();
  });
});
