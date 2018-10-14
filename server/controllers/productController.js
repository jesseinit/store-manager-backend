import ProductHelper from '../helpers/productHelper';

class ProductController {
  static getAllProducts(req, res) {
    const products = ProductHelper.allProducts();
    res.status(200).json({ result: products });
  }
}

export default ProductController;
