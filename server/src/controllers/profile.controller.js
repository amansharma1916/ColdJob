import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as UserService from '../services/user.service.js';
import * as AuthService from '../services/auth.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.getProfile(req.user._id);
  sendSuccess(res, 200, 'Profile retrieved', profile);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await UserService.updateProfile(req.user._id, req.body);
  sendSuccess(res, 200, 'Profile updated', profile);
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await AuthService.logout(req.user._id);
  await UserService.deleteAccount(req.user._id);
  sendSuccess(res, 200, 'Account deleted');
});