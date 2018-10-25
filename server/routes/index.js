import { Router } from 'express';
import products from './products';
import sales from './sales';
import user from './user';

const router = Router();

router.use('/api/v1', user, products, sales);

router.use((err, req, res, next) => {
  res.status(err.status).json({ status: false, message: err.message });
  next();
});

export default router;
