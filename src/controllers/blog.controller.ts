import { NextFunction, Request, Response } from 'express';
import { Blog } from '../models/blog.model';
import { findAllBlogs, createBlog, findBlog, findBlogById, updateBlog, deleteBlog } from '../services/blog.service';
import { statusCode } from '../utils/constants/statusCode';

// Get list blog
export const getBlogsHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
      // Get list user
      const blogs = await findAllBlogs();

      res.status(statusCode.OK).json({
          status: 'success',
          data: blogs,
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

// Get list my blog
export const getMyBlogHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const blogs = await findBlog({userId: user._id}, {})
    res.status(statusCode.OK).json({
        status: 'success',
        data: [blogs]
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

//  Create a new blog
export const createBlogHandler = async (
  req: Request<{}, {}, Blog>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const blog = await createBlog({
        title: req.body.title,
        description: req.body.description,
        userId: user._id
    })
    res.status(statusCode.CREATED).json({
        status: 'success',
        data: [blog]
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

// Update blog
export const UpdateBlogHandler = async (
  req: Request<any, {}, Blog>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if Blog already exists
    const existingBlog = await findBlogById(req.params.blogId);
    if (!existingBlog)
      return res.status(statusCode.NOT_FOUND).json({
        status: 'failed',
        data: [],
        message: 'Blog not found',
      });
    const user = res.locals.user;
    const blog = await updateBlog(req.params.blogId, {
        title: req.body.title,
        description: req.body.description,
        // userId: user._id
    })
    res.status(statusCode.OK).json({
        status: 'success',
        data: [blog],
        message: 'Blog Updated',
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
// Delete blog
export const deleteBlogHandler = async (
  req: Request<any, {}, Blog>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if Blog already exists
    const existingBlog = await findBlogById(req.params.blogId);
    if (!existingBlog)
      return res.status(statusCode.NOT_FOUND).json({
        status: 'failed',
        data: [],
        message: 'Blog not found',
      });
    const user = res.locals.user;
    const blog = await deleteBlog(req.params.blogId)
    res.status(statusCode.OK).json({
        status: 'success',
        message: 'Blog Deleted',
    });
  } catch (err: any) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        code: statusCode.INTERNAL_SERVER_ERROR,
        data: [],
        message: err.message ||  'Internal Server Error',
    });
  }
}

