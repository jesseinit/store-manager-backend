import { Router } from 'express';
import products from './products';
import sales from './sales';

const router = Router();
router.use((req, res, next) => {
  req.validationErrors = [];
  next();
});
router.use('/api/v1', products, sales);
router.all('*', (req, res) => {
  res.status(404).send({ message: 'Welcome to the Begining of Awesomeness 🚀' });
});
export default router;
