import { Router } from 'express';

import ProductController from '../../controllers/productController';
import validtor from '../../middleware/inputValidator';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get(
  '/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  ProductController.getSingleProduct
);
router.post(
  '/',
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
