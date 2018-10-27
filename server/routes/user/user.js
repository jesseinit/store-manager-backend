import { Router } from 'express';

import UserController from '../../controllers/userController';
import validations from '../../middleware/inputValidator';
import authMiddleware from '../../middleware/auth';

const auth = Router();
const users = Router();

auth.post('/login', validations.validateLogin, validations.validationHandler, UserController.loginUser);

auth.post(
  '/signup',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validations.validateSignup,
  validations.validationHandler,
  UserController.createUser
);

users.get('/', authMiddleware.verifyToken, authMiddleware.adminOnly, UserController.getAllUsers);

export { auth, users };
