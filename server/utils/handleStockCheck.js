import pool from './connection';
// import errorHandler from './errorHandler';

const stockCheck = (req, res, next) => {
  let cartLength = 0;
  const totalProds = req.body.products.length;
  let totalSaleAmt = 0;

  req.body.products.forEach(async product => {
    const productFound = await pool.query('Select name,price from products where id = $1', [product.id]);

    if (productFound.rowCount < 1) {
      res.status(400).json({ status: false, message: `Product with id ${product.id} is not found` });
      return;
    }

    const totalPerProduct = productFound.rows[0].price * product.qty;
    const productInfo = await pool.query('Select qty,name from products where id = $1', [product.id]);

    if (product.qty > productInfo.rows[0].qty) {
      res.status(400).json({
        status: false,
        message: `${productInfo.rows[0].name} does not have the request quantity in stock`
      });
    } else {
      cartLength += 1;
      totalSaleAmt += totalPerProduct;

      if (cartLength === totalProds) {
        req.total = totalSaleAmt;
        next();
      }
    }
  });
};
export default stockCheck;
