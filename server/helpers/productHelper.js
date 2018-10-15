import products from '../models/products';

class ProductHelper {
  static allProducts() {
    return products;
  }

  static getSingleProduct(prodId) {
    const productFound = [];
    products.forEach(product => {
      if (product.id === prodId) {
        productFound.push(product);
      }
    });
    return productFound;
  }
}

export default ProductHelper;
