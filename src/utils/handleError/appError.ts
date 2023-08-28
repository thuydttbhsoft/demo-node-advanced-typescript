import { Response } from 'express';
export const AppError = (message: string, statusCode: number = 500, res: Response) => {
    const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    return res.status(statusCode).json({
      status,
      code: statusCode,
      data: [],
      message: message ||  'Internal Server Error',
    });
}
  