import { Router } from 'express';

import { getInfo } from './info.controller';

export const InfoRouter = (): Router => {
  return Router().get('/', getInfo);
};
