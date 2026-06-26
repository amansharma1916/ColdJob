import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as EmailService from '../services/email.service.js';

export const sendEmail = asyncHandler(async (req, res) => {
  const result = await EmailService.sendSingleEmail(req.user._id, req.validated.body);
  sendSuccess(res, 200, 'Email sent', result);
});

export const sendBulkEmail = asyncHandler(async (req, res) => {
  const result = await EmailService.sendBulkEmail(req.user._id, req.validated.body);
  sendSuccess(res, 200, 'Bulk email processed', result);
});

export const previewEmail = asyncHandler(async (req, res) => {
  const preview = await EmailService.previewEmail(req.user._id, req.validated.body);
  sendSuccess(res, 200, 'Email preview generated', preview);
});