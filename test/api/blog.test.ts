import request from 'supertest';
import app from '../../src/app';

import { statusCode } from '../../src/utils/constants/statusCode';
import mongoose from 'mongoose';

// Import and mock the MongoDB operations
import mockedModel from '../../src/models/blog.model';
import { NextFunction, Request, Response } from 'express';
jest.mock('../../src/models/blog.model');
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
  const fakeBlogList = [
    {
      _id: '64dc6dbca2eba7e1ae7f5f7e',
      title: 'Title 1',
      description: 'Description 1',
      createdAt: '2023-08-18T03:56:53.184Z',
      updatedAt: '2023-08-18T04:24:43.777Z',
      __v: 0,
    },
    {
      _id: '64deec0507d82ec29e0279e0',
      title: 'Title2',
      description: 'Description 2',
      createdAt: '2023-08-18T03:56:53.184Z',
      updatedAt: '2023-08-18T04:24:43.777Z',
      __v: 0,
    },
    {
      _id: '64deec802b5e4c9aa85fcc9f',
      title: 'Title 3 test update',
      description: 'Description 3',
      created_at: '2023-08-18T03:58:56.109Z',
      __v: 0,
      createdAt: '2023-08-18T03:56:53.184Z',
      updatedAt: '2023-08-18T04:24:43.777Z',
    },
  ];

  // Test for get list Blog
  it('should get list Blog', async () => {
    mockedModel.find = jest.fn().mockResolvedValue(fakeBlogList);

    const res = await request(app).get('/api/blogs');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.length).toBe(3);
  });

  // Test for create a new Blog
  it('should create a new Blog', async () => {
    // Mock the 'save' function to resolve with a mocked Blog object
    const mockBlogInstance = {
      _id: 'mockId',
      title: 'Mocked Blog',
      description: 'Mocked Description',
      userId: '',
    };
    mockedModel.create = jest.fn().mockResolvedValue(mockBlogInstance);
    const response = await request(app).post('/api/blogs').send({
      title: 'Mocked Blog',
      description: 'Mocked Description',
    });

    // Assertions
    expect(response.status).toBe(statusCode.CREATED);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('userId');
    expect(response.body.data.title).toBe('Mocked Blog');
    expect(response.body.data.description).toBe('Mocked Description');
  });

  // Test for create a new Blog with validate (title is required)
  it('should create a new Blog with validate title', async () => {
    const response = await request(app).post('/api/blogs').send({
      title: '',
      description: 'Mocked Description',
    });

    // Assertions
    expect(response.status).toBe(statusCode.BAD_REQUEST);
    expect(response.body).toHaveProperty('errors');
  });

  // Test for updating a Blog
  it('should update a Blog by ID', async () => {
    const updatedBlog = {
      title: 'Updated Blog',
      description: 'Updated Description',
    };
    const mockBlogInstance = {
      _id: 'mockId',
      userId: '',
      ...updatedBlog,
    };
    mockedModel.findOneAndUpdate = jest
      .fn()
      .mockResolvedValue(mockBlogInstance);
    mockedModel.findById = jest.fn().mockResolvedValue(fakeBlogList[0]);
    const BlogId = fakeBlogList[1]._id; // Replace with an actual Blog ID
    const response = await request(app)
      .put(`/api/blogs/${BlogId}`)
      .send(updatedBlog);

    expect(response.status).toBe(statusCode.OK);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.title).toBe('Updated Blog');
    expect(response.body.data.description).toBe('Updated Description');
  });

  // Test for updating a Blog with id not found
  it('should update a Blog with Blog not found', async () => {
    const updatedBlog = {
      title: 'Updated Blog',
      description: 'Updated Description',
    };
    mockedModel.findById = jest.fn().mockResolvedValue(false);
    mockedModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedBlog);
    const BlogId = '64dc6dbca2eba7e1ae7f5f7a'; // Replace with an actual Blog ID
    const response = await request(app)
      .put(`/api/blogs/${BlogId}`)
      .send(updatedBlog);

    expect(response.status).toBe(statusCode.NOT_FOUND);
    expect(response.body.message).toBe('Blog not found');
  });

  // Test for deleting a Blog
  it('should delete a Blog by ID', async () => {
    mockedModel.findById = jest.fn().mockResolvedValue(fakeBlogList[0]);
    mockedModel.deleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });
    const BlogId = fakeBlogList[1]._id; // Replace with an actual Blog ID
    const response = await request(app).delete(`/api/blogs/${BlogId}`);

    expect(response.status).toBe(statusCode.OK);
    expect(response.body.message).toBe('Blog Deleted');
  });

  // Test for deleting a Blog with id not found
  it('should delete a Blog by ID with Blog not found', async () => {
    mockedModel.findById = jest.fn().mockResolvedValue(null);
    const BlogId = '64dc6dbca2eba7e1ae7f5f6b'; // Replace with an actual Blog ID
    const response = await request(app).delete(`/api/blogs/${BlogId}`);

    expect(response.status).toBe(statusCode.NOT_FOUND);
    expect(response.body.message).toBe('Blog not found');
  });
});
