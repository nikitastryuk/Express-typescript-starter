import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { getInfo } from './info.controller';

export const InfoRouter = (): Router => {
  return Router().get('/', expressAsyncHandler(getInfo));
};
