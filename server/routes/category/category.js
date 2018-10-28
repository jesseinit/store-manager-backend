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

export default router;
