import { removeHashKeyFromCache } from '../../config/cache';
import { ApiError, ErrorResponse } from '../../helpers/error';
import { IPagedCollection } from './user.controller';
import { IUser, IUserLocation, User } from './user.model';

export interface IUserRepository {
  getUsersEnrichedByDistance(lng: number, lat: number, offset: number, limit: number): Promise<IPagedCollection<IUser>>;
  getUsers(offset?: number, limit?: number): Promise<IPagedCollection<IUser>>;
  getUser(id: string): Promise<IUser>;
  createUser(firstName: string, lastName: string, location: IUserLocation): Promise<IUser>;
  updateUser(id: string, updates: IUserUpdateFields): Promise<IUser>;
  deleteUser(id: string): Promise<void>;
}

export interface IUserUpdateFields {
  firstName?: string;
  lastName?: string;
  location: {
    coordinates?: [number, number];
    name?: string;
  };
}

export class UserRepository implements IUserRepository {
  public async getUsersEnrichedByDistance(lng: number, lat: number, offset: number, limit: number): Promise<IPagedCollection<IUser>> {
    const coordinates = [+lng, +lat];
    const query = {
      $geoNear: {
        distanceField: 'distance',
        distanceMultiplier: 1 / 1000,
        near: { coordinates, type: 'Point' },
        spherical: true,
      },
    };
    const data: IUser[] = await User.aggregate([query, { $skip: offset }, { $limit: limit }]);
    const totalCount: number = (await User.aggregate([query])).length;
    return {
      data,
      totalCount,
    };
  }

  public async getUsers(offset: number, limit: number): Promise<IPagedCollection<IUser>> {
    const data: IUser[] = await User.find()
      .skip(offset)
      .limit(limit);
    const totalCount: number = (await User.find()).length;
    return {
      data,
      totalCount,
    };
  }

  public async getUser(id: string): Promise<IUser> {
    // Caching
    const user = await User.findById(id).cache({
      hashKey: id,
    });
    if (!user) throw new ApiError(ErrorResponse.MissingResourceId('User', id));
    return user;
  }

  public async createUser(firstName: string, lastName: string, location: IUserLocation): Promise<IUser> {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.location = location;
    await user.save();
    return user;
  }
  public async updateUser(id: string, updates: IUserUpdateFields): Promise<IUser> {
    const { firstName, lastName, location } = updates;
    const user = await User.findById(id);
    if (!user) throw new ApiError(ErrorResponse.MissingResourceId('User', id));
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (location) {
      if (location.name) {
        user.location.name = location.name;
      }
      if (location.coordinates) {
        user.location.coordinates = location.coordinates;
      }
    }
    await user.save();
    // Caching
    removeHashKeyFromCache(id);
    return user;
  }
  public async deleteUser(id: string): Promise<void> {
    await User.findOneAndDelete(id);
    // Caching
    removeHashKeyFromCache(id);
  }
}
