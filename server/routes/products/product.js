import { Router } from 'express';

import ProductController from '../../controllers/productController';
import validator from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';
import parseForm from '../../middleware/parseForm';

const router = Router();

router.get(
  '/',
  authMiddleware.verifyToken,
  validator.valaidateGetProducts,
  validator.validationHandler,
  ProductController.getAllProducts
);

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
  parseForm.single('imageUrl'),
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
  parseForm.single('imageUrl'),
  ProductController.updateProduct
);

router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateProductId,
  validator.validationHandler,
  ProductController.deleteProduct
);

export default router;
