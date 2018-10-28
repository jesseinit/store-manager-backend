import { Router } from 'express';
import products from './products';
import sales from './sales';
import user from './user';
import category from './category';

const router = Router();

router.use('/api/v1', user, category, products, sales);

export default router;
