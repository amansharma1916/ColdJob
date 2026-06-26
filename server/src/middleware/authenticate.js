import { verifyAccessToken } from '../helpers/jwt.helper.js';
import User from '../models/User.model.js';
import { AuthError } from '../errors/AuthError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthError('No token provided.');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.userId).select('-encryptedRefreshToken');
  if (!user) {
    throw new AuthError('User not found.');
  }
  if (!user.isActive) {
    throw new AuthError('Account deactivated.');
  }

  req.user = user;
  next();
});