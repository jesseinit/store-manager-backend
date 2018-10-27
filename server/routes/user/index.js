import { Router } from 'express';
import auth from './user';

const router = Router();
router.use('/auth', auth);

export default router;
