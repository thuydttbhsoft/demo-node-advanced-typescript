import express from 'express';
import { loginHandler, registerHandler } from '../controllers/auth.controller';
// import { validate } from '../middlewares/joi.middleware';
// import UserValidate from '../utils/validators/user';
// import LoginValidate from '../utils/validators/login';
import { validateRequest } from '../middlewares/validator.middleware';
import { LoginDto, UserDto } from '../utils/dto/user.dto';

const router = express.Router();

// Register user route
router.post('/register', validateRequest(UserDto), registerHandler);

// Login user route
router.post('/login', validateRequest(LoginDto), loginHandler);

export default router;
