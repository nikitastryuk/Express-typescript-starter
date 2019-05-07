import { isNumber } from '../../helpers/typeGuards';
import { IUser, IUserLocation } from './user.model';
import { IUserRepository, IUserUpdateFields } from './user.repo';

// TODO: Move to shared models
export interface IPagedCollection<T> {
  data: T[];
  totalCount?: number;
}
export interface IUserController {
  getUsers(offset: number, limit: number, sort?: string, lng?: number, lat?: number): Promise<IPagedCollection<IUser>>;
  getUser(id: string): Promise<IUser>;
  createUser(firstName: string, lastName: string, location: IUserLocation): Promise<IUser>;
  updateUser(id: string, updates: IUserUpdateFields): Promise<IUser>;
  deleteUser(id: string): Promise<void>;
}

export class UserController implements IUserController {
  constructor(private readonly userRepository: IUserRepository) {}

  public async getUsers(offset: number, limit: number, sort?: string, lng?: number, lat?: number): Promise<IPagedCollection<IUser>> {
    if (sort === 'location' && isNumber(lng) && isNumber(lat)) {
      return this.userRepository.getUsersEnrichedByDistance(lng, lat, offset, limit);
    }
    return this.userRepository.getUsers(offset, limit);
  }
  public async getUser(id: string): Promise<IUser> {
    return this.userRepository.getUser(id);
  }
  public async createUser(firstName: string, lastName: string, location: IUserLocation): Promise<IUser> {
    return this.userRepository.createUser(firstName, lastName, location);
  }
  public async updateUser(id: string, updates: IUserUpdateFields): Promise<IUser> {
    return this.userRepository.updateUser(id, updates);
  }
  public async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }
}
