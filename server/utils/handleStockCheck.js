import pool from './connection';
import responseHandler from './responseHandler';

const stockCheck = (req, res, next) => {
  const _ = undefined;
  let totalProds = 0;
  let totalSaleAmt = 0;
  const cartProducts = req.body.products;
  const cartLength = req.body.products.length;

  if (cartLength > 10) {
    responseHandler(_, _, res, 400, 'failure', 'You can only checkout 10 items per transaction.');
    return;
  }

  const isUniqueProductList = cartProducts
    .map(product => product.id)
    .every((value, index, array) => array.lastIndexOf(value) === index);

  if (isUniqueProductList === false) {
    responseHandler(_, _, res, 400, 'failure', 'Products can only appear once in the cart');
    return;
  }

  cartProducts.forEach(async product => {
    const productInfo = await pool.query(
      'Select product_name,product_price,product_qty from products where product_id = $1',
      [product.id]
    );

    if (productInfo.rowCount < 1) {
      responseHandler(_, _, res, 404, 'failure', `Product with id ${product.id} is not found`);
      return;
    }

    const productWorth = productInfo.rows[0].product_price * product.qty;

    if (product.qty > productInfo.rows[0].product_qty) {
      responseHandler(
        _,
        _,
        res,
        400,
        'failure',
        `Cant process the requested quantity on ${productInfo.rows[0].product_name}`
      );
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
