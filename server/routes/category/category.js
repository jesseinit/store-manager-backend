import { Router } from 'express';
import validator from '../../middleware/inputValidator';
import CategoryController from '../../controllers/categoryController';
import authMiddleware from '../../middleware/auth';

const router = Router();

router.post(
  '/',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateNewCategory,
  validator.validationHandler,
  CategoryController.createCategory
);

router.put(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateUpdateCategory,
  validator.validationHandler,
  CategoryController.updateCategory
);

router.get('/', authMiddleware.verifyToken, CategoryController.getAllCategories);

router.get(
  '/:id',
  authMiddleware.verifyToken,
  validator.validateCategoryId,
  validator.validationHandler,
  CategoryController.getSingleCategory
);

router.delete(
  '/:id',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validator.validateCategoryId,
  validator.validationHandler,
  CategoryController.deleteCategory
);

export default router;
