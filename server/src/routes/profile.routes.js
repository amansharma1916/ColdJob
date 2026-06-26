import { Router } from 'express';
import * as ProfileController from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, ProfileController.getProfile);
router.patch('/', authenticate, ProfileController.updateProfile);
router.delete('/', authenticate, ProfileController.deleteAccount);

export default router;