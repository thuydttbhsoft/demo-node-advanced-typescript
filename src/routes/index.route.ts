import express from 'express';
import authRouter from './auth.route';
import userRouter from './user.route';
import blogRouter from './blog.route';

const router = express.Router();
// api for user
router.use('/api/users', userRouter);
//api login and register
router.use('/api/auth', authRouter);
// api for blog
router.use('/api/blogs', blogRouter);

export default router;