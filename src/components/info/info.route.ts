import { Request, Response, Router } from 'express';

const getInfoHandler = (_req: Request, res: Response) => {
  res.send({
    name: process.env.NAME,
    serverDateTime: new Date().toISOString(),
  });
};

export const InfoRouter = (): Router => {
  return Router().get('/', getInfoHandler);
};
