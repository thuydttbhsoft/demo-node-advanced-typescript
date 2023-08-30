import { NextFunction, Request, Response } from 'express';
import { createUser, findUser } from '../services/user.service';
import { User } from '../models/user.model';
import { generateToken } from '../utils/helpers/jwt.helper';
import { statusCode } from '../utils/constants/statusCode';
export const excludedFields = ['password'];

export const registerHandler = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user already exists
    const existingUser = await findUser({ email: req.body.email });
    if (existingUser)
      return res.status(400).json({
        status: 'failed',
        data: [],
        message: 'It seems you already have an account, please log in instead.',
      });
    // save new user into the database
    const user = await createUser({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });
    res.status(statusCode.OK).json({
      status: 'success',
      data: user,
      message:
        'Thank you for registering with us. Your account has been successfully created.',
    });
  } catch (err: any) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: statusCode.INTERNAL_SERVER_ERROR,
      data: [],
      message: err.message || 'Internal Server Error',
    });
  }
};

export const loginHandler = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the user from the collection
    const user = await findUser({ email: req.body.email });

    // Check if user exist and password is correct
    if (
      !user ||
      !(await user.comparePasswords(user.password, req.body.password))
    ) {
      return res.status(statusCode.NOT_AUTHORIZE).json({
        status: 'failed',
        data: [],
        message: 'Invalid email or password',
      });
    }

    // Create an Access Token
    const accessToken = await generateToken(user);
    // Send Access Token

    res.status(statusCode.OK).json({
      status: 'success',
      message: 'You have successfully logged in.',
      accessToken,
    });
  } catch (err: any) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      code: statusCode.INTERNAL_SERVER_ERROR,
      data: [],
      message: err.message || 'Internal Server Error',
    });
  }
};
