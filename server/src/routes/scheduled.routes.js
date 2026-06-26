import { Router } from 'express';
import * as ScheduledController from '../controllers/scheduled.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { paginationSchema, idParamSchema } from '../validators/query.validator.js';
import { createScheduledEmailSchema } from '../validators/email.validator.js';

const router = Router();

router.get('/', authenticate, validate(paginationSchema), ScheduledController.getScheduledEmails);
router.get('/:id', authenticate, validate(idParamSchema), ScheduledController.getScheduledEmail);
router.post('/', authenticate, validate(createScheduledEmailSchema), ScheduledController.createScheduledEmail);
router.delete('/:id', authenticate, validate(idParamSchema), ScheduledController.cancelScheduledEmail);

export default router;