import { Router } from 'express';
import * as EmailController from '../controllers/email.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { sendEmailSchema, sendBulkEmailSchema, previewEmailSchema } from '../validators/email.validator.js';
import { emailSendLimiter, bulkEmailLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/send', authenticate, emailSendLimiter, validate(sendEmailSchema), EmailController.sendEmail);
router.post('/bulk', authenticate, bulkEmailLimiter, validate(sendBulkEmailSchema), EmailController.sendBulkEmail);
router.post('/preview', authenticate, validate(previewEmailSchema), EmailController.previewEmail);

export default router;