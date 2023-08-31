import express from 'express';
import { deserializeUser } from '../middlewares/auth.middleware';
import {
  getBlogsHandler,
  getMyBlogHandler,
  createBlogHandler,
  UpdateBlogHandler,
  deleteBlogHandler,
} from '../controllers/blog.controller';
import { validateRequest } from '../middlewares/validator.middleware';
import { BlogDto } from '../utils/dto/blog.dto';

const router = express.Router();
router.use(deserializeUser);
// get list blog
router.get('/', getBlogsHandler);
router.get('/my-blog', getMyBlogHandler);
// create a new blog
router.post('/', validateRequest(BlogDto), createBlogHandler);
// update blog
router.put('/:blogId', validateRequest(BlogDto), UpdateBlogHandler);
//delete blog
router.delete('/:blogId', deleteBlogHandler);
export default router;
