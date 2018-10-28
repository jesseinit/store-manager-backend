import 'babel-polyfill';
import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';

/**
 *
 * @description Contains helper methods that interacts with the data persistence layer
 * @class CategoryHelper
 */
class CategoryHelper {
  /**
   *
   * @description Helper method that creates a new product category
   * @static
   * @param {string} CategoryName Category name to be created
   * @returns {object} A created category object
   * @memberof UserHelper
   */
  static async createCategory(categoryName) {
    try {
      const foundCategory = await pool.query(query.findCategory(categoryName));
      if (foundCategory.rows.length > 0) {
        errorHandler(400, 'A category with that name exists.');
      }
      const createdCategory = await pool.query(query.createCategory(categoryName));
      return createdCategory.rows[0];
    } catch (error) {
      return error;
    }
  }
}

export default CategoryHelper;
