import { Request, Response } from 'express';

export const getInfo = async (_req: Request, res: Response) => {
  res.send({
    name: process.env.NAME,
    serverDateTime: new Date().toISOString(),
  });
};
