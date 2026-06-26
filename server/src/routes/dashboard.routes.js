import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, DashboardController.getDashboard);

export default router;