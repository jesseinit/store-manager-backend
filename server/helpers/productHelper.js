import products from '../models/products';
import isEmptyObject from '../utils/isEmptyObject';
import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';

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
  static async allProducts() {
    const allProducts = await pool.query(query.getAllProducts());
    if (allProducts.rowCount < 1) {
      return 'No product created yet.';
    }
    return allProducts.rows;
  }

  /**
   *
   * @description Helper method that gets a single product's represenation
   * @static
   * @returns {object} An object of the found product or empty object if not found
   * @param {number} prodId Id of the product to be retrieved
   * @memberof ProductHelper
   */
  static async getSingleProduct(prodId) {
    try {
      const foundProduct = await pool.query(query.getProductById(prodId));
      if (foundProduct.rowCount < 1) {
        errorHandler(404, 'Product not found');
      }
      return foundProduct.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that creates a product and mutates the data structure
   * @static
   * @param {object} newProduct New product object to be created
   * @returns {object}
   * @memberof ProductHelper
   */
  static async createProduct(newProduct) {
    try {
      const foundCategory = await pool.query(query.findCategoryById(newProduct.categoryid));
      if (foundCategory.rowCount < 1) {
        errorHandler(400, 'The category does not exit');
      }

      const allProducts = await pool.query(query.getAllProducts());
      const isExists = allProducts.rows.some(product => product.name === newProduct.name);

      if (isExists) {
        errorHandler(400, 'The provided product name already exists.');
      }

      const createdProduct = await pool.query(query.createProduct(newProduct));
      return createdProduct.rows[0];
    } catch (error) {
      return error;
    }
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
