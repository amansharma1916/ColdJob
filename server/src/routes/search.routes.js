import { Router } from 'express';
import * as SearchController from '../controllers/search.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, SearchController.globalSearch);

export default router;