import 'babel-polyfill';
import CategoryHelper from '../helpers/categoryHelper';

/**
 *
 * @description Represent a collection of route handlers for the category resource
 * @class CategoryController
 */
class CategoryController {
  /**
   *
   * @description Create a new product category in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {object} A created category object
   * @memberof CategoryController
   */
  static async createCategory(req, res, next) {
    const result = await CategoryHelper.createCategory(req.body.name);
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(201).json({ status: true, result });
  }

  /**
   *
   * @description Updates a product category in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {object} Updated category object
   * @memberof CategoryController
   */
  static async updateCategory(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;

    const result = await CategoryHelper.updateCategory({ id, name });
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, result });
  }

  /**
   *
   * @description Retrieves all product categories in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {array} List of all product categories
   * @memberof CategoryController
   */
  static async getAllCategories(req, res, next) {
    const result = await CategoryHelper.getAllCategories();
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, result });
  }
}

export default CategoryController;
