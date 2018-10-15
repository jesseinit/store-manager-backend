import products from '../models/products';

/**
 *
 * @description Helper class that handles request to the data store
 * @class ProductHelper
 */
class ProductHelper {
  /**
   *
   * @description Helper method that gets current represenation from the data structure
   * @static
   * @returns {object} An array of objects
   * @memberof ProductHelper
   */
  static allProducts() {
    return products;
  }

  /**
   *
   * @description Helper method that gets a single product's represenation from the data structure
   * @static
   * @returns {object} An array of objects
   * @param {*} prodId Id of the product to be retrieved
   * @memberof ProductHelper
   */
  static getSingleProduct(prodId) {
    const productFound = [];
    products.forEach(product => {
      if (product.id === prodId) {
        productFound.push(product);
      }
    });
    return productFound;
  }

  /**
   *
   * @description Helper method that creates a product and mutates the data structure
   * @static
   * @param {*} newProduct New product object to be created
   * @returns {object} An array with a value of the new product
   * @memberof ProductHelper
   */
  static createProduct(newProduct) {
    const createdProduct = {
      id: products[products.length - 1].id + 1,
      imgUrl: newProduct.imgUrl,
      name: newProduct.name,
      category: newProduct.category,
      price: parseInt(newProduct.price, 10),
      qty: parseInt(newProduct.qty, 10)
    };
    products.push(createdProduct);
    return [createdProduct];
  }

  static updateProduct(productArg) {
    const updatedProduct = [];
    products.forEach(product => {
      if (product.id === productArg.id) {
        const modifiedProduct = {
          id: product.id,
          imgUrl: product.imgUrl === productArg.imgUrl ? product.imgUrl : productArg.imgUrl,
          name: product.name === productArg.name ? product.name : productArg.name,
          category: product.category === productArg.category ? product.category : productArg.category,
          qty: product.qty === productArg.qty ? product.qty : productArg.qty,
          price: product.price === productArg.price ? product.price : productArg.price
        };
        updatedProduct.push(modifiedProduct);
        products[products.indexOf(product)] = modifiedProduct;
      }
    });
    return updatedProduct;
  }
}

export default ProductHelper;
