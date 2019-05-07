import { Handler, Request, Response, Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import httpStatus from 'http-status';

import { IPagedCollection, IUserController } from './user.controller';
import { IUser } from './user.model';
import { createUserValidator, deleteUserValidator, getUsersValidator, getUserValidator, updateUserValidator } from './user.validation';

function getUsersHandler(userController: IUserController): Handler {
  return async (req: Request, res: Response) => {
    const { offset, limit, sort, lng, lat } = req.query;
    const collection: IPagedCollection<IUser> = await userController.getUsers(offset, limit, sort, +lng, +lat);
    return res.json(collection);
  };
}

function getUserHandler(userController: IUserController): Handler {
  return async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user: IUser = await userController.getUser(userId);
    return res.json(user);
  };
}

function createUserHandler(userController: IUserController): Handler {
  return async (req: Request, res: Response) => {
    const { firstName, lastName, location } = req.body;
    const user: IUser = await userController.createUser(firstName, lastName, location);
    return res.status(httpStatus.CREATED).json(user);
  };
}

function updateUserHandler(userController: IUserController): Handler {
  return async (req: Request, res: Response) => {
    const { firstName, lastName, location } = req.body;
    const userId = req.params.id;
    const user: IUser = await userController.updateUser(userId, { firstName, lastName, location });
    return res.status(httpStatus.CREATED).json(user);
  };
}

function deleteUserHandler(userController: IUserController): Handler {
  return async (req: Request, res: Response) => {
    const userId = req.params.id;
    await userController.deleteUser(userId);
    return res.status(httpStatus.OK).send();
  };
}

export const UserRouter = (userController: IUserController): Router => {
  const router = Router();

  router.get('/', getUsersValidator, expressAsyncHandler(getUsersHandler(userController)));
  router.post('/', createUserValidator, expressAsyncHandler(createUserHandler(userController)));
  router.get('/:id', getUserValidator, expressAsyncHandler(getUserHandler(userController)));
  router.put('/:id', updateUserValidator, expressAsyncHandler(updateUserHandler(userController)));
  router.delete('/:id', deleteUserValidator, expressAsyncHandler(deleteUserHandler(userController)));

  return router;
};
