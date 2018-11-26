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
users.get(
  '/:userid',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validations.validateUserId,
  validations.validationHandler,
  UserController.getSingleUsers
);

users.put(
  '/:userid',
  authMiddleware.verifyToken,
  authMiddleware.adminOnly,
  validations.validateUserUpdate,
  validations.validationHandler,
  UserController.updateUser
);

users.delete(
  '/:userid',
  authMiddleware.verifyToken,
  authMiddleware.ownerOnly,
  validations.validateUserDelete,
  validations.validationHandler,
  UserController.deleteUser
);

export { auth, users };
