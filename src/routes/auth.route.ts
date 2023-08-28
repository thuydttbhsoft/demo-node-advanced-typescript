import express from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';
import { validate } from '../middlewares/joi.middleware';
import UserValidate from '../utils/validators/user';
import LoginValidate from '../utils/validators/login';

const router = express.Router();

// Register user route
router.post('/register', validate(UserValidate), registerHandler);

// Login user route
router.post('/login', validate(LoginValidate), loginHandler);

export default router;
