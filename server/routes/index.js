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
export default router;
