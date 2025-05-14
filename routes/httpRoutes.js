import { Router } from 'express';
import limiter from '../middlewares/rateLimiter.js';
import {
  healthCheck,
  saveText,
  getText,
  purgeEverything
} from '../controllers/httpControllers.js';
import simpleAuth from '@/middlewares/simpleAuth.js';
import localAuth from '@/middlewares/localAuth.js';

const router = Router();

router.get('/healthcheck', localAuth, healthCheck);
router.post('/save', limiter, saveText);
router.post('/get', limiter, getText);
router.post('/purge', localAuth, purgeEverything);

export default router;
