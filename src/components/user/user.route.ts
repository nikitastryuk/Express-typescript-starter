import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { createUser, deleteUser, getUser, getUsers, updateUser } from './user.controller';
import { createUserValidator, deleteUserValidator, getUserValidator, updateUserValidator } from './user.validation';

export const UserRouter = (): Router => {
  const router = Router();

  router.get('/', expressAsyncHandler(getUsers));
  router.post('/', createUserValidator, expressAsyncHandler(createUser));
  router.get('/:id', getUserValidator, expressAsyncHandler(getUser));
  router.put('/:id', updateUserValidator, expressAsyncHandler(updateUser));
  router.delete('/:id', deleteUserValidator, expressAsyncHandler(deleteUser));

  return router;
};
