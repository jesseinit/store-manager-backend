import ProductHelper from '../helpers/productHelper';
import isEmptyObject from '../utils/isEmptyObject';

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
    const products = await ProductHelper.allProducts();
    res.status(200).json({ status: true, result: products });
  }

  /**
   * @description Retrieves a single product from the data source
   * @returns {object} Returned product object
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static getSingleProduct(req, res) {
    const productId = parseInt(req.params.id, 10);
    const product = ProductHelper.getSingleProduct(productId);
    if (isEmptyObject(product)) {
      res.status(404).json({ status: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ status: true, result: product });
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
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(201).json({ status: true, result });
  }

  /**
   * @description Updates a product
   * @returns {object} Updated product
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static updateProduct(req, res) {
    const id = parseInt(req.params.id, 10);
    const { imgUrl, name, category, price, qty } = req.body;
    const updatedProduct = ProductHelper.updateProduct({
      id,
      imgUrl,
      name,
      category,
      price,
      qty
    });
    if (isEmptyObject(updatedProduct)) {
      res.status(404).json({ status: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ status: true, result: updatedProduct });
  }

  /**
   * @description Deletes a product
   * @returns {boolean} Deletion status
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static deleteProduct(req, res) {
    const productId = parseInt(req.params.id, 10);
    const isDeleted = ProductHelper.deleteProduct(productId);
    if (!isDeleted) {
      res.status(404).json({ status: false, message: 'Product not found' });
      return;
    }
    res.status(200).json({ status: true, message: 'Product deleted' });
  }
}

export default ProductController;
