import ProductHelper from '../helpers/productHelper';
import handleResponse from '../utils/responseHandler';

/**
 *
 * @description Represents blueprint of methods that gets or mutates store products
 * @class ProductController
 */
class ProductController {
  /**
   * @description Retrieves all the products from the data source
   * @returns {array} Returned products array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static async getAllProducts(req, res) {
    const result = await ProductHelper.allProducts();
    res.status(200).json({ status: true, message: result });
  }

  /**
   * @description Retrieves a single product from the data source
   * @returns {object} Returned product object
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static async getProductById(req, res, next) {
    const result = await ProductHelper.getProductById(req.params.id);
    handleResponse(result, next, res);
  }

  /**
   * @description Creates a new product
   * @returns {object} Created product
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static async createProduct(req, res, next) {
    const result = await ProductHelper.createProduct(req.body);
    handleResponse(result, next, res, 201);
  }

  /**
   * @description Updates a product
   * @returns {object} Updated product
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static async updateProduct(req, res, next) {
    const id = parseInt(req.params.id, 10);
    const result = await ProductHelper.updateProduct({
      id,
      body: req.body
    });
    handleResponse(result, next, res);
  }

  /**
   * @description Deletes a product
   * @returns {boolean} Deletion status
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static async deleteProduct(req, res, next) {
    const productId = parseInt(req.params.id, 10);
    const result = await ProductHelper.deleteProduct(productId);

    handleResponse(result, next, res);
  }
}

export default ProductController;
