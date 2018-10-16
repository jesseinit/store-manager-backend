import express from 'express';
import ProductController from '../controllers/productController';
import validtor from '../middleware/inputValidator';

const router = express.Router();

router.get('/products', ProductController.getAllProducts);
router.get(
  '/products/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  ProductController.getSingleProduct
);
router.post(
  '/products',
  validtor.validateNewProduct,
  validtor.validationHandler,
  ProductController.createProduct
);
router.put(
  '/products/:id',
  validtor.validateProductUpdate,
  validtor.validationHandler,
  ProductController.updateProduct
);
router.delete(
  '/products/:id',
  validtor.validateProductId,
  validtor.validationHandler,
  ProductController.deleteProduct
);
export default router;
