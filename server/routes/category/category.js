import { Router } from 'express';
import validtor from '../../middleware/inputValidator';
import CategoryController from '../../controllers/categoryController';
import authMiddleware from '../../middleware/auth';

const router = Router();

router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validtor.validateNewCategory,
  validtor.validationHandler,
  CategoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validtor.validateUpdateCategory,
  validtor.validationHandler,
  CategoryController.updateCategory
);

router.get(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  CategoryController.getAllCategories
);

export default router;
