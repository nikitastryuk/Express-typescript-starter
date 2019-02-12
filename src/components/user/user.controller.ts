import { Request, Response } from 'express';
import { ApiError, ErrorResponse } from '../../helpers/error';

export const getUser = async (_req: Request, res: Response) => {
  throw new ApiError(ErrorResponse.WrongEndpoint);
  res.send('1');
};
