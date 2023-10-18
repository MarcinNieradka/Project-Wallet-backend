import User from '../service/schemas/users.js';
import passport from '../utils/config-passport.js';
import jwt from 'jsonwebtoken';
import { refreshTokens } from '../controllers/userController.js';

export const auth = async (req, res, next) => {
  try {
    await passport.authenticate('jwt', { session: false }, async (err, user) => {
      if (!user || err) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Unauthorized',
          data: 'Unauthorized',
        });
      }

      const authHeader = req.headers.authorization;
      const token = authHeader ? authHeader.split(' ')[1] : null;

      const allUsers = await User.find();
      if (!allUsers.some(user => user.token === token)) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Token not valid',
          data: 'Token not valid',
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: 'An error occurred during authentication.',
    });
  }
};
