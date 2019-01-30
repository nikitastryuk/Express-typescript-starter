import { Request, Response } from 'express';

export const getInfo = (_req: Request, res: Response) => {
  res.send({
    name: process.env.NAME,
    serverDateTime: new Date().toISOString(),
  });
};
