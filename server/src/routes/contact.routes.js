import { Router } from 'express';
import * as ContactController from '../controllers/contact.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createContactSchema, updateContactSchema } from '../validators/contact.validator.js';
import { paginationSchema, idParamSchema } from '../validators/query.validator.js';
import { uploadSingle } from '../middleware/upload.js';

const router = Router();

router.get('/', authenticate, validate(paginationSchema), ContactController.getContacts);
router.post('/', authenticate, validate(createContactSchema), ContactController.createContact);
router.get('/export', authenticate, ContactController.exportContacts);
router.get('/:id', authenticate, validate(idParamSchema), ContactController.getContact);
router.put('/:id', authenticate, validate(idParamSchema), validate(updateContactSchema), ContactController.updateContact);
router.delete('/:id', authenticate, validate(idParamSchema), ContactController.deleteContact);
router.post('/import', authenticate, uploadSingle, ContactController.importContacts);

export default router;