import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as ScheduledService from '../services/scheduled.service.js';

export const getScheduledEmails = asyncHandler(async (req, res) => {
  const result = await ScheduledService.getScheduledEmails(req.user._id, req.query);
  sendSuccess(res, 200, 'Scheduled emails retrieved', result);
});

export const getScheduledEmail = asyncHandler(async (req, res) => {
  const email = await ScheduledService.getScheduledEmail(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Scheduled email retrieved', email);
});

export const cancelScheduledEmail = asyncHandler(async (req, res) => {
  const email = await ScheduledService.cancelScheduledEmail(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Scheduled email cancelled', email);
});

export const createScheduledEmail = asyncHandler(async (req, res) => {
  const email = await ScheduledService.createScheduledEmail(req.user._id, req.validated.body);
  sendSuccess(res, 201, 'Scheduled email created', email);
});