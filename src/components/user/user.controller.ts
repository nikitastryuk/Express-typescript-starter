import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { ApiError, ErrorResponse } from '../../helpers/error';
import { User } from './user.model';

export const getUsers = async (req: Request, res: Response) => {
  const { sort, lat, lng } = req.query;
  if (sort === 'location') {
    const coordinates = [+lng, +lat];
    // Enrich users with distance field
    const enrichedUsers = await User.aggregate([
      {
        $geoNear: {
          distanceField: 'distance',
          distanceMultiplier: 1 / 1000,
          near: { coordinates, type: 'Point' },
          spherical: true,
        },
      },
    ]);
    return res.json(enrichedUsers);
  }
  const users = await User.find({});
  return res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(ErrorResponse.MissingResourceId('User', userId));
  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, location } = req.body;
  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.location = location;
  await user.save();
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const { firstName, lastName, location } = req.body;
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(ErrorResponse.MissingResourceId('User', userId));
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (location) user.location = location;
  await user.save();
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  await User.findOneAndDelete(userId);
  res.status(httpStatus.OK).send();
};
