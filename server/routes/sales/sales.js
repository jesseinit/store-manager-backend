import { Router } from 'express';

import SalesController from '../../controllers/saleController';
import validator from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';
import stockCheck from '../../utils/handleStockCheck';

const router = Router();

router.get('/', SalesController.getAllSales);
router.get('/:id', validator.validateSaleId, validator.validationHandler, SalesController.getSingleSale);
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.attendantOnly,
  validator.validateNewSale,
  validator.validationHandler,
  stockCheck,
  SalesController.createNewSale
);

export default router;
