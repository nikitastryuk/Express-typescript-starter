import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { getUser } from './user.controller';

export const UserRouter = (): Router => {
  return Router().get('/user', expressAsyncHandler(getUser));
};
