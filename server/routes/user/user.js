import { Router } from 'express';

import UserController from '../../controllers/userController';
import validations from '../../middleware/inputValidator';

const router = Router();

router.post(
  '/login',
  validations.validateLogin,
  validations.validationHandler,
  UserController.loginUser
);

export default router;
