import { Router } from 'express';
import products from './products';
import sales from './sales';
import user from './user';
import category from './category';

const router = Router();

router.use('/api/v1', user, category, products, sales);
router.all('*', (req, res) => {
  res.status(404).json({ message: 'This route does not exist. Recheck parameters.' });
});
export default router;
