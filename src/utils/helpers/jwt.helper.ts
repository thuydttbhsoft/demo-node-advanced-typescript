import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { DocumentType } from '@typegoose/typegoose';

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY ?? '';
const JWT_ACCESS_TOKEN_LIFE = process.env.JWT_EXPIRES_IN;

export const generateToken = async (
  user: DocumentType<User>,
): Promise<string> => {
  return await jwt.sign({ ...user._doc }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_LIFE,
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  } catch (error: any) {
    console.log(error.message);
    return false;
  }
};
