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
   * @returns {object} An array containg the found product or undefined if product was not found
   * @param {number} prodId Id of the product to be retrieved
   * @memberof ProductHelper
   */
  static getSingleProduct(prodId) {
    return [products.find(product => product.id === prodId)];
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

  /**
   *
   * @description Helper method that updates a product and mutates the data structure
   * @static
   * @param {*} productArg Updated product object body
   * @returns {object} An array with an object reporesenting the updated product
   * @memberof ProductHelper
   */
  static updateProduct(productArg) {
    const foundProduct = products.find(product => product.id === productArg.id);
    if (!foundProduct) {
      return [];
    }
    foundProduct.imgUrl = productArg.imgUrl;
    foundProduct.name = productArg.name;
    foundProduct.category = productArg.category;
    foundProduct.price = parseInt(productArg.price, 10);
    foundProduct.qty = parseInt(productArg.qty, 10);
    return [foundProduct];
  }

  /**
   *
   * @description Helper method that delete a product and mutates the data structure
   * @static
   * @param {*} prodId Product ID of the product to be deleted
   * @memberof ProductHelper
   */
  static deleteProduct(prodId) {
    const foundProduct = products.find(product => product.id === prodId);
    if (!foundProduct) {
      return false;
    }
    const foundProductIndex = products.indexOf(foundProduct);
    products.splice(foundProductIndex, 1);
    return true;
  }

  /**
   *
   * @description Helper method that checks if a product is available and has stock
   * @static
   * @param {number} product
   * @returns Boolean
   * @memberof ProductHelper
   */
  static hasStock(product) {
    const retrievedProduct = this.getSingleProduct(product.id);
    if (retrievedProduct.length < 1 || product.qty > retrievedProduct[0].qty) {
      return false;
    }
    return true;
  }

  /**
   *
   * @description Helper method that updates the product stock details
   * @static
   * @param {*} product
   * @memberof ProductHelper
   */
  static updateStock(product) {
    const retrievedProduct = this.getSingleProduct(product.id)[0];
    retrievedProduct.qty -= product.qty;
  }
}

export default ProductHelper;
