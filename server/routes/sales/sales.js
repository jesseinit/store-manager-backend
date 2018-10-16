import { Router } from 'express';

import SalesController from '../../controllers/saleController';
import validtor from '../../middleware/inputValidator';

const router = Router();

router.get('/', SalesController.getAllSales);
router.get(
  '/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  SalesController.getSingleSale
);
router.post('/', validtor.validateNewSale, validtor.validationHandler, SalesController.createNewSale);

export default router;
