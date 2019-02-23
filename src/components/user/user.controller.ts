import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { removeHashKeyFromCache } from '../../../src/config/cache';
import { ApiError, ErrorResponse } from '../../helpers/error';
import { User } from './user.model';

export const getUsers = async (req: Request, res: Response) => {
  const { sort, lat, lng, offset, limit } = req.query;
  if (sort === 'location') {
    const coordinates = [+lng, +lat];
    const query = {
      $geoNear: {
        distanceField: 'distance',
        distanceMultiplier: 1 / 1000,
        near: { coordinates, type: 'Point' },
        spherical: true,
      },
    };
    // Enrich users with distance field
    const enrichedUsers = await User.aggregate([query, { $skip: +offset }, { $limit: +limit }]);
    const totalCount = (await User.aggregate([query])).length;
    return res.json({
      totalCount,
      users: enrichedUsers,
    });
  }
  const query = {};
  const users = await User.find(query)
    .skip(+offset)
    .limit(+limit);
  const totalCount = (await User.find(query)).length;
  return res.json({
    totalCount,
    users,
  });
};

export const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await User.findById(userId).cache({
    hashKey: userId,
  });
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
  res.status(httpStatus.CREATED).json(user);
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
  removeHashKeyFromCache(userId);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  await User.findOneAndDelete(userId);
  res.status(httpStatus.OK).send();
};
