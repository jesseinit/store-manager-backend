import { Router } from 'express';
import products from './product';

const router = Router();

router.use('/products', products);

export default router;
