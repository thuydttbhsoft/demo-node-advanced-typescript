
import { FilterQuery, QueryOptions } from 'mongoose';

import userModel, { User } from '../models/user.model';

require('dotenv').config();
// CreateUser service
export const createUser = async (input: Partial<User>) => {
  const user = await userModel.create(input);
  return user;
};

// Find User by Id
export const findUserById = async (id: string) => {
  const user = await userModel.findById(id).lean();
  return user;
};

// Find All users
export const findAllUsers = async () => {
  return await userModel.find();
};

// Find one user by any fields
export const findUser = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await userModel.findOne(query, {}, options).select('+password');
};
