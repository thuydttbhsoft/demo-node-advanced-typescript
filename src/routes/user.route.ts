import express from 'express';
import { deserializeUser } from '../middlewares/auth.middleware';
import { getUsersHandler } from '../controllers/user.controller';

const router = express.Router();
router.use(deserializeUser);
// get list user
router.get('/', getUsersHandler);
export default router;
