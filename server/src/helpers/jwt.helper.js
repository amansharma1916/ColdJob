import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthError } from '../errors/AuthError.js';

export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AuthError('Token expired.');
    }
    throw new AuthError('Invalid token.');
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};