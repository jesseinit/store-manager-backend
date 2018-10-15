import ProductHelper from '../helpers/productHelper';

class ProductController {
  static getAllProducts(req, res) {
    const products = ProductHelper.allProducts();
    res.status(200).json({ result: products });
  }

  static getSingleProduct(req, res) {
    const productId = parseInt(req.params.id, 10);
    const product = ProductHelper.getSingleProduct(productId);
    if (!product.length) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ result: product });
  }
}

export default ProductController;
