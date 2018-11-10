import 'babel-polyfill';
import CategoryHelper from '../helpers/categoryHelper';
import handleResponse from '../utils/responseHandler';

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
    handleResponse(result, next, res, 201, 'success', 'Category created successfully.');
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
    handleResponse(result, next, res, 200, 'success', 'Category updated successfully.');
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
    handleResponse(result, next, res, 200, 'success', 'Categories retrieved successfully.');
  }

  /**
   *
   * @description Deletes a product categories in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {boolean} Result of the operation
   * @memberof CategoryController
   */
  static async deleteCategory(req, res, next) {
    const { id } = req.params;
    const result = await CategoryHelper.deleteCategory(id);
    handleResponse(result, next, res, 200, 'success', undefined);
  }
}

export default CategoryController;
