import { Router } from 'express';

import SalesController from '../../controllers/saleController';

const router = Router();

router.get('/', SalesController.getAllProducts);

export default router;
