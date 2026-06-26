import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as HistoryService from '../services/history.service.js';
import * as EmailService from '../services/email.service.js';
import EmailHistory from '../models/EmailHistory.model.js';

export const getEmailHistory = asyncHandler(async (req, res) => {
  const result = await HistoryService.getHistory(req.user._id, req.query);
  sendSuccess(res, 200, 'Email history retrieved', result);
});

export const getEmailDetail = asyncHandler(async (req, res) => {
  const entry = await HistoryService.getDetail(req.user._id, req.params.id);
  sendSuccess(res, 200, 'Email detail retrieved', entry);
});

export const retryEmail = asyncHandler(async (req, res) => {
  const history = await EmailHistory.findOne({ _id: req.params.id, userId: req.user._id });
  if (!history) {
    return sendSuccess(res, 404, 'Email history entry not found');
  }

  const result = await EmailService.sendSingleEmail(req.user._id, {
    recipientEmail: history.recipientEmail,
    recipientName: history.recipientName,
    templateId: history.templateId,
    resumeId: history.resumeId,
  });

  sendSuccess(res, 200, 'Email retried successfully', result);
});