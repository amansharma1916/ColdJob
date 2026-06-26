import { Router } from 'express';
import * as HistoryController from '../controllers/history.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { historyQuerySchema } from '../validators/query.validator.js';
import { idParamSchema } from '../validators/query.validator.js';

const router = Router();

router.get('/', authenticate, validate(historyQuerySchema), HistoryController.getEmailHistory);
router.get('/:id', authenticate, validate(idParamSchema), HistoryController.getEmailDetail);
router.post('/:id/retry', authenticate, validate(idParamSchema), HistoryController.retryEmail);

export default router;