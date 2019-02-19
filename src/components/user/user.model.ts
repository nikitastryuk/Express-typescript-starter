import { Document, model, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
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
  location: {
    required: true,
    type: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
      name: {
        type: String,
      },
    },
  },
});

export const User: Model<IUser> = model<IUser>('user', UserSchema);
