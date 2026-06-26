import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import authRoutes from './auth.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import templateRoutes from './template.routes.js';
import resumeRoutes from './resume.routes.js';
import contactRoutes from './contact.routes.js';
import emailRoutes from './email.routes.js';
import historyRoutes from './history.routes.js';
import scheduledRoutes from './scheduled.routes.js';
import settingsRoutes from './settings.routes.js';
import profileRoutes from './profile.routes.js';
import searchRoutes from './search.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', authenticate, dashboardRoutes);
router.use('/templates', authenticate, templateRoutes);
router.use('/resumes', authenticate, resumeRoutes);
router.use('/contacts', authenticate, contactRoutes);
router.use('/email', authenticate, emailRoutes);
router.use('/history', authenticate, historyRoutes);
router.use('/scheduled', authenticate, scheduledRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/profile', authenticate, profileRoutes);
router.use('/search', authenticate, searchRoutes);

export default router;
