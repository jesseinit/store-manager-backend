import { Router } from 'express';
import products from './products';
import sales from './sales';
import user from './user';

const router = Router();

router.use('/api/v1', user, products, sales);

export default router;
