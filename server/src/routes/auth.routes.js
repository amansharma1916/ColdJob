import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { refreshTokenSchema } from '../validators/auth.validator.js';

const router = Router();

router.get('/google', authRateLimiter, AuthController.initiateGoogleLogin);
router.get('/google/callback', authRateLimiter, AuthController.handleGoogleCallback);
router.post('/refresh', authenticate, AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.getMe);

export default router;