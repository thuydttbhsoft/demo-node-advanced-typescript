import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { statusCode } from '../utils/constants/statusCode';

export function validateRequest(dtoType: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToClass(dtoType, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      return res.status(statusCode.BAD_REQUEST).json({ errors: errors.map(error => error.constraints) });
    }

    next();
  };
}