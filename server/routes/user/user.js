import { Router } from 'express';

import UserController from '../../controllers/userController';
import validations from '../../middleware/inputValidator';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/login',
  validations.validateLogin,
  validations.validationHandler,
  UserController.loginUser
);

router.post(
  '/signup',
  auth.verifyToken,
  auth.adminOnly,
  validations.validateSignup,
  validations.validationHandler,
  UserController.createUser
);

export default router;
