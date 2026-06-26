import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as AuthService from '../services/auth.service.js';
import { env } from '../config/env.js';

export const initiateGoogleLogin = asyncHandler(async (req, res) => {
  const url = AuthService.getAuthUrl();
  res.redirect(url);
});

export const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;
  const result = await AuthService.handleOAuthCallback(code);
  res.redirect(`${env.CLIENT_URL}/login?token=${result.token}`);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await AuthService.refreshGoogleToken(req.user._id);
  sendSuccess(res, 200, 'Token refreshed', result);
});

export const logout = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user._id);
  sendSuccess(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'User profile', { user: req.user.toSafeObject() });
});