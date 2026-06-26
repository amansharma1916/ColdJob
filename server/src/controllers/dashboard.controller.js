import {asyncHandler} from '../utils/asyncHandler.js';
import { sendSuccess } from '../helpers/response.helper.js';
import * as DashboardService from '../services/dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getStats(req.user._id);
  sendSuccess(res, 200, 'Dashboard data retrieved', stats);
});