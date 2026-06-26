import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as SettingsService from '../services/settings.service.js';

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.getSettings(req.user._id);
  sendSuccess(res, 200, 'Settings retrieved', settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSettings(req.user._id, req.validated.body);
  sendSuccess(res, 200, 'Settings updated', settings);
});

export const updateSignature = asyncHandler(async (req, res) => {
  const settings = await SettingsService.updateSignature(req.user._id, req.body.signature);
  sendSuccess(res, 200, 'Signature updated', settings);
});
