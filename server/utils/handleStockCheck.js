import pool from './connection';
import responseHandler from './responseHandler';

const stockCheck = (req, res, next) => {
  const _ = undefined;
  let totalProds = 0;
  let totalSaleAmt = 0;
  const cartLength = req.body.products.length;

  const isUniqueProductList = req.body.products
    .map(product => product.id)
    .every((value, index, array) => array.lastIndexOf(value) === index);

  if (isUniqueProductList === false) {
    responseHandler(_, _, res, 400, 'failure', 'Products can only appear once in the cart');
    return;
  }

  req.body.products.forEach(async product => {
    const productInfo = await pool.query('Select name,price,qty from products where id = $1', [product.id]);

    if (productInfo.rowCount < 1) {
      responseHandler(_, _, res, 400, 'failure', `Product with id ${product.id} is not found`);
      return;
    }

    const productWorth = productInfo.rows[0].price * product.qty;

    if (product.qty > productInfo.rows[0].qty) {
      responseHandler(_, _, res, 400, 'failure', `Cant process the requested quantity on ${productInfo.rows[0].name}`);
    } else {
      totalProds += 1;
      totalSaleAmt += productWorth;
    }

    if (cartLength === totalProds) {
      req.total = totalSaleAmt;
      next();
    }
  });
};
export default stockCheck;
