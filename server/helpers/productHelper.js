import products from '../models/products';
import isEmptyObject from '../utils/isEmptyObject';

/**
 *
 * @description Helper class that handles request to the data store
 * @class ProductHelper
 */
class ProductHelper {
  /**
   *
   * @description Helper method that gets all products represenation from the data source
   * @static
   * @returns {array} An array of products objects
   * @memberof ProductHelper
   */
  static allProducts() {
    return products;
  }

  /**
   *
   * @description Helper method that gets a single product's represenation from the data structure
   * @static
   * @returns {object} An object of the found product or empty object if not found
   * @param {number} prodId Id of the product to be retrieved
   * @memberof ProductHelper
   */
  static getSingleProduct(prodId) {
    const foundProduct = products.find(product => product.id === prodId);
    if (!foundProduct) {
      return {};
    }
    return foundProduct;
  }

  /**
   *
   * @description Helper method that creates a product and mutates the data structure
   * @static
   * @param {object} newProduct New product object to be created
   * @returns {object}
   * @memberof ProductHelper
   */
  static createProduct(newProduct) {
    const isExists = products.some(product => product.name === newProduct.name);
    if (isExists) {
      return {};
    }
    const createdProduct = {
      id: products[products.length - 1].id + 1,
      imgUrl: newProduct.imgUrl,
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      qty: parseInt(newProduct.qty, 10)
    };
    products.push(createdProduct);
    return createdProduct;
  }

  /**
   *
   * @description Helper method that updates a product and mutates the data structure
   * @static
   * @param {object} productArg Updated information object
   * @returns {object} An object with an object reporesenting the updated product
   * @memberof ProductHelper
   */
  static updateProduct(productArg) {
    const foundProduct = products.find(product => product.id === productArg.id);
    if (!foundProduct) {
      return {};
    }
    const productUpdateName = productArg.name.replace(/\s\s+/g, ' ').trim();
    foundProduct.imgUrl = productArg.imgUrl;
    foundProduct.name = productUpdateName;
    foundProduct.category = productArg.category;
    foundProduct.price = parseFloat(productArg.price);
    foundProduct.qty = parseInt(productArg.qty, 10);
    return foundProduct;
  }

  /**
   *
   * @description Helper method that delete a product and mutates the data structure
   * @static
   * @param {number} prodId Product ID of the product to be deleted
   * @returns {boolean} Boolean to confirm product deletion or failure
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
   * @param {object} product Product whose stock check is to be carried on
   * @returns {boolean} Boolean that shows stock availability
   * @memberof ProductHelper
   */
  static inStock(product) {
    const retrievedProduct = this.getSingleProduct(product.id);
    if (isEmptyObject(retrievedProduct) || product.qty > retrievedProduct.qty) {
      return false;
    }
    return true;
  }

  /**
   *
   * @description Helper method that updates the product stock details
   * @static
   * @param {object} product Product to whose stock is to be updated
   * @memberof ProductHelper
   */
  static updateStock(product) {
    const retrievedProduct = this.getSingleProduct(product.id);
    retrievedProduct.qty -= product.qty;
  }
}

export default ProductHelper;
