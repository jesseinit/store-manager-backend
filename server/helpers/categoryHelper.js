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
   * @memberof CategoryHelper
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

  /**
   *
   * @description Helper method that updates a new product category
   * @static
   * @param {object} CategoryInfo Category information to be updated
   * @returns {object} An updated category
   * @memberof CategoryHelper
   */
  static async updateCategory(categoryInfo) {
    try {
      const foundCategory = await pool.query(query.findCategoryById(categoryInfo.id));
      if (foundCategory.rows.length < 1) {
        errorHandler(404, 'The category not found.');
      }
      const allCategories = await pool.query(query.getAllCategories());
      const isCategoryExists = allCategories.rows.some(
        category => category.categoryname === categoryInfo.name
      );
      if (isCategoryExists) {
        errorHandler(400, 'The category name already exists.');
      }
      const createdCategory = await pool.query(query.updateCategory(categoryInfo.id, categoryInfo.name));
      return createdCategory.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that retrieves all product categories
   * @static
   * @returns {array} A list of product categories
   * @memberof CategoryHelper
   */
  static async getAllCategories() {
    try {
      const allCategories = await pool.query(query.getAllCategories());
      if (allCategories.rows.length < 1) {
        return 'You have no product category yet.';
      }
      return allCategories.rows;
    } catch (error) {
      return error;
    }
  }
}

export default CategoryHelper;
