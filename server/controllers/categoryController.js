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
}

export default CategoryController;
