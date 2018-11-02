import { Router } from 'express';

import SalesController from '../../controllers/saleController';
import validator from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';
import stockCheck from '../../utils/handleStockCheck';

const router = Router();

router.get('/', authMiddleware.verifyToken, authMiddleware.adminOnly, SalesController.getAllSales);
router.get(
  '/:id',
  authMiddleware.verifyToken,
  validator.validateSaleId,
  validator.validationHandler,
  SalesController.getSingleSale
);
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
