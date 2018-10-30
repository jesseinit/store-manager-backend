import { Router } from 'express';

import ProductController from '../../controllers/productController';
import validtor from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware.verifyToken, ProductController.getAllProducts);
router.get(
  '/:id',
  authMiddleware.verifyToken,
  validtor.validateProductId,
  validtor.validationHandler,
  ProductController.getSingleProduct
);
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validtor.validateNewProduct,
  validtor.validationHandler,
  ProductController.createProduct
);
router.put(
  '/:id',
  validtor.validateProductUpdate,
  validtor.validationHandler,
  ProductController.updateProduct
);
router.delete(
  '/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  ProductController.deleteProduct
);

export default router;
