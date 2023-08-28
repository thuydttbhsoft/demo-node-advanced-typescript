import { Response } from 'express';
export const AppError = (
  message: string,
  statusCode: number = 500,
  res: Response,
) => {
  return res.status(statusCode).json({
    data: [],
    message: message || 'Internal Server Error',
  });
};
