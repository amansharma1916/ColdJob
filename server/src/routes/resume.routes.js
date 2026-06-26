import { Router } from 'express';
import * as ResumeController from '../controllers/resume.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { updateResumeSchema } from '../validators/resume.validator.js';
import { paginationSchema, idParamSchema } from '../validators/query.validator.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, validate(paginationSchema), ResumeController.getResumes);
router.post('/', authenticate, uploadSingle, ResumeController.uploadResume);
router.get('/:id', authenticate, validate(idParamSchema), ResumeController.getResume);
router.patch('/:id', authenticate, validate(idParamSchema), validate(updateResumeSchema), ResumeController.updateResume);
router.delete('/:id', authenticate, validate(idParamSchema), ResumeController.deleteResume);
router.patch('/:id/default', authenticate, validate(idParamSchema), ResumeController.setDefault);

export default router;