import { Router } from 'express';
import * as TemplateController from '../controllers/template.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  createTemplateSchema,
  updateTemplateSchema,
  previewTemplateSchema,
} from '../validators/template.validator.js';
import { paginationSchema, idParamSchema } from '../validators/query.validator.js';

const router = Router();

router.get('/', authenticate, validate(paginationSchema), TemplateController.getTemplates);
router.post('/', authenticate, validate(createTemplateSchema), TemplateController.createTemplate);
router.get('/:id', authenticate, validate(idParamSchema), TemplateController.getTemplate);
router.put('/:id', authenticate, validate(idParamSchema), validate(updateTemplateSchema), TemplateController.updateTemplate);
router.delete('/:id', authenticate, validate(idParamSchema), TemplateController.deleteTemplate);
router.patch('/:id/default', authenticate, validate(idParamSchema), TemplateController.setDefault);
router.post('/:id/duplicate', authenticate, validate(idParamSchema), TemplateController.duplicateTemplate);
router.post('/preview', authenticate, validate(previewTemplateSchema), TemplateController.previewTemplate);

export default router;
