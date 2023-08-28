import { NextFunction, Request, Response } from 'express';
import { Schema } from 'mongoose';

const Joi = require('joi');
export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const options = { abortEarly: false };
    const { error } = Joi.compile(schema.body).validate(req.body, options);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message);
      res.status(422).json({ error: message });
    }
  };
};
