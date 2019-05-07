import { Document, model, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  location: IUserLocation;
}

export interface IUserLocation {
  coordinates: [number, number];
  name: string;
}

const UserSchema = new Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  // GeoJSON
  location: {
    coordinates: {
      index: '2dsphere',
      required: true,
      type: [Number],
    },
    name: {
      required: true,
      type: String,
    },
    type: {
      default: 'Point',
      type: String,
    },
  },
});

export const User: Model<IUser> = model<IUser>('user', UserSchema);
