import { db } from '../config/db';
import { initialUsers } from '../seed/seedData';

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  avatar?: string;
  title?: string;
  phone?: string;
  wishlist: string[];
  preferences?: {
    preferredStyle?: string;
    propertyType?: string;
  };
  status: 'active' | 'deactivated';
  resetToken?: string;
  resetExpires?: number;
  createdAt: string;
  updatedAt?: string;
}

export const UserModel = db.initCollection<IUser>('users', initialUsers as IUser[]);
