import { Router } from 'express';
import sales from './sales';

const router = Router();

router.use('/sales', sales);

export default router;
