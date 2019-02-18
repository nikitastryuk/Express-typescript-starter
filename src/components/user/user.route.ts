import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { getUser } from './user.controller';

export const UserRouter = (): Router => {
  const router = Router();

  router.get('/', expressAsyncHandler(getUser));

  return router;
};
