import { Router } from 'express';

import ProductController from '../../controllers/productController';
import validator from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';

const router = Router();

router.get('/', authMiddleware.verifyToken, ProductController.getAllProducts);
router.get(
  '/:id',
  authMiddleware.verifyToken,
  validator.validateProductId,
  validator.validationHandler,
  ProductController.getProductById
);
router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateNewProduct,
  validator.validationHandler,
  ProductController.createProduct
);
router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateProductUpdate,
  validator.validationHandler,
  ProductController.updateProduct
);
router.delete(
  '/:id',
  validator.validateProductId,
  validator.validationHandler,
  ProductController.deleteProduct
);

export default router;
