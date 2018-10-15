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
export default router;
