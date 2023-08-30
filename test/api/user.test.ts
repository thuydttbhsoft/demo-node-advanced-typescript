import request from 'supertest';
import app from '../../src/app';

import { statusCode } from '../../src/utils/constants/statusCode';
import mongoose from 'mongoose';

// Import and mock the MongoDB operations
import userModel from '../../src/models/user.model';
import { NextFunction, Request, Response } from 'express';
jest.mock('../../src/models/user.model');
jest.mock('../../src/middlewares/auth.middleware', () => ({
  deserializeUser: (req: Request, res: Response, next: NextFunction) => {
    res.locals.user = {
      id: 'fakeUserId',
    };
    next();
  },
}));

beforeAll((done) => {
  done();
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
describe('Blog API', () => {
  // Test data
  const fakeUserList = [
    {
      _id: '64dc6dbca2eba7e1ae7f5f7e',
      name: 'Name 1',
      email: 'test_1@gmail.com',
      password: 'test_1',
      createdAt: '2023-08-18T03:56:53.184Z',
      updatedAt: '2023-08-18T04:24:43.777Z',
      __v: 0,
    },
    {
      _id: '64deec0507d82ec29e0279e0',
      name: 'Name 2',
      email: 'test_2@gmail.com',
      password: 'test_',
      createdAt: '2023-08-18T03:56:53.184Z',
      updatedAt: '2023-08-18T04:24:43.777Z',
      __v: 0,
    },
  ];

  // Test for get list Blog
  it('should get list Blog', async () => {
    userModel.find = jest.fn().mockResolvedValue(fakeUserList);

    const res = await request(app).get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.length).toBe(2);
  });
});
