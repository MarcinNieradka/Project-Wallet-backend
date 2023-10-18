import express from 'express';
import { auth } from '../../middlewares/authMiddleware.js';
import { validateRegistration, validateLogin } from '../../middlewares/validationMiddleware.js';

export const usersRouter = express.Router();

import {
  registerUser,
  loginUser,
  refreshTokens,
  getUserProfile,
  logoutUser,
} from '../../controllers/userController.js';

usersRouter.post('/register', validateRegistration, registerUser);

usersRouter.post('/login', validateLogin, loginUser);

usersRouter.post('/refresh', refreshTokens); //refresh token

usersRouter.get('/profile', auth, getUserProfile); // get user data (name mail)

usersRouter.post('/logout', auth, logoutUser);
