import { NextFunction, Request, Response } from 'express';
import { findAllUsers } from '../services/user.service';
import { statusCode } from '../utils/constants/statusCode';
// Exclude this fields from the response
export const excludedFields = ['password'];

export const getUsersHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
      // Get list user
      const users = await findAllUsers();

      res.status(statusCode.OK).json({
          status: 'success',
          data: users,
      });
  } catch (err: any) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: statusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: err.message ||  'Internal Server Error',
    });
  }
};


