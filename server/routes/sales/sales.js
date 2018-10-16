import { Router } from 'express';

import SalesController from '../../controllers/saleController';
import validtor from '../../middleware/inputValidator';

const router = Router();

router.get('/', SalesController.getAllProducts);
router.get(
  '/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  SalesController.getSingleSale
);

export default router;
