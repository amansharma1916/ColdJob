import { Router } from 'express';
import * as SettingsController from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { updateSettingsSchema } from '../validators/settings.validator.js';

const router = Router();

router.get('/', authenticate, SettingsController.getSettings);
router.put('/', authenticate, validate(updateSettingsSchema), SettingsController.updateSettings);
router.put('/signature', authenticate, SettingsController.updateSignature);

export default router;
