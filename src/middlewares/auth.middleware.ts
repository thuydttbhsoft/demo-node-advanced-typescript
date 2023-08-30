import { NextFunction, Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import { statusCode } from '../utils/constants/statusCode';
import { AppError } from '../utils/handleError/appError';
import { verifyToken } from '../utils/helpers/jwt.helper';

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get the token
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return AppError('You are not logged in', statusCode.NOT_AUTHORIZE, res);
    }

    // Validate Access Token
    // Verify token and get data from token
    const user = verifyToken(access_token);

    if (!user) {
      return AppError(
        `Invalid token or user doesn't exist`,
        statusCode.NOT_AUTHORIZE,
        res,
      );
    }

    // Check if user still exist
    const userLogin = await findUserById(user._id);

    if (!userLogin) {
      return AppError(
        `User with that token no longer exist`,
        statusCode.NOT_AUTHORIZE,
        res,
      );
    }

    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
