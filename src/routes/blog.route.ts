import express from 'express';
import { deserializeUser } from '../middlewares/auth.middleware';
import {
  getBlogsHandler,
  getMyBlogHandler,
  createBlogHandler,
  UpdateBlogHandler,
  deleteBlogHandler,
} from '../controllers/blog.controller';
import { validate } from '../middlewares/joi.middleware';
import BlogValidate from '../utils/validators/blog';

const router = express.Router();
router.use(deserializeUser);
// get list blog
router.get('/', getBlogsHandler);
router.get('/my-blog', getMyBlogHandler);
// create a new blog
router.post('/', validate(BlogValidate), createBlogHandler);
// update blog
router.put('/:blogId', validate(BlogValidate), UpdateBlogHandler);
//delete blog
router.delete('/:blogId', deleteBlogHandler);
export default router;
