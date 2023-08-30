import request from 'supertest';
import app from '../../src/app';

import userModel from '../../src/models/user.model';
jest.mock('../../src/models/user.model'); // Mock the user module
jest.mock('../../src/utils/helpers/jwt.helper', () => ({
  generateToken: () => {
    const fakeToken = 'fakeAccessToken';
    return fakeToken;
  },
  verifyToken: (tọken: string) => {
    return {
      _id: '64dc6dbca2eba7e1ae7f5f7e',
      email: 'test@example.com',
    };
  },
}));

describe('Login API', () => {
  it('should respond with 200 and access token on successful login', async () => {
    const mockUser = jest.fn().mockResolvedValue({
      email: 'test@example.com',
      password: 'hashedPassword',
      comparePasswords: jest.fn().mockResolvedValue(true),
    });
    // Mock findUser function to return the mockUser
    userModel.findOne = jest.fn().mockReturnValue({ select: mockUser });

    const req = {
      body: {
        email: 'test@example.com',
        password: 'password',
      },
    };

    const res = await request(app).post('/api/auth/login').send(req.body);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      status: 'success',
      message: 'You have successfully logged in.',
      accessToken: 'fakeAccessToken',
    });
  });

  it('should respond with 401 for invalid credentials', async () => {
    const mockUser = jest.fn().mockResolvedValue(null);
    // Mock findUser function to return null (user not found)
    userModel.findOne = jest.fn().mockReturnValue({ select: mockUser });

    const req = {
      body: {
        email: 'test@example.com',
        password: 'invalidPassword',
      },
    };
    const res = await request(app).post('/api/auth/login').send(req.body);

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      status: 'failed',
      data: [],
      message: 'Invalid email or password',
    });
  });
});

describe('Signup API', () => {
  it('should respond with 200 and success message for new user registration', async () => {
    const selectMock = jest.fn().mockResolvedValue(null);
    // Mock findUser function to return null (user not found)
    userModel.findOne = jest.fn().mockReturnValue({ select: selectMock });

    // Mock createUser to return a mock user object
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
    };
    userModel.create = jest.fn().mockResolvedValue(mockUser);

    const req = {
      body: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      },
    };
    const res = await request(app).post('/api/auth/register').send(req.body);

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      status: 'success',
      data: mockUser,
      message:
        'Thank you for registering with us. Your account has been successfully created.',
    });
  });

  it('should respond with 400 for existing user registration', async () => {
    // Mock findUser to return a user (user already exists)
    userModel.findOne = jest
      .fn()
      .mockReturnValue({
        select: jest
          .fn()
          .mockResolvedValue({
            id: '456',
            email: 'test@example.com',
            name: 'Existing User',
          }),
      });

    const req = {
      body: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      },
    };
    const res = await request(app).post('/api/auth/register').send(req.body);

    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      status: 'failed',
      data: [],
      message: 'It seems you already have an account, please log in instead.',
    });
  });
});

describe('Authenticated Request', () => {
  it('should make an authenticated request', async () => {
    userModel.findById = jest.fn().mockResolvedValue({
      _id: '64dc6dbca2eba7e1ae7f5f7e',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password',
    });
    const token = 'fake token'; // Replace with your actual Bearer token

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
  it('should return 401 for unauthorized request', async () => {
    userModel.findById = jest.fn().mockResolvedValue(null);
    const invalidToken = 'invalidToken'; // Replace with an invalid token

    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
  });
});
