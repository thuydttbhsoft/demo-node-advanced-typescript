import { FilterQuery, QueryOptions } from 'mongoose';

import blogModel, { Blog } from '../models/blog.model';

require('dotenv').config();
// CreateBlog service
export const createBlog = async (input: Blog) => {
  const blog = await blogModel.create(input);
  return blog;
};

// UpdateBlog service
export const updateBlog = async (
  id: string,
  input: { title: string; description: string },
) => {
  const blog = await blogModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        ...input,
      },
    },
  );
  return blog;
};

// Find Blog by Id
export const findBlogById = async (id: string) => {
  const blog = await blogModel.findById(id);
  return blog;
};

// Find All Blogs
export const findAllBlogs = async () => {
  return await blogModel.find();
};

// Find one Blog by any fields
export const findBlog = async (
  query: FilterQuery<Blog>,
  options: QueryOptions = {},
) => {
  return await blogModel.findOne(query, {}, options);
};

// delete Blogs
export const deleteBlog = async (id: string) => {
  return await blogModel.deleteOne({ _id: id });
};
