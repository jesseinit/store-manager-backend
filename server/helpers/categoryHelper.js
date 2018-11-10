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
      const foundCategory = await pool.query(query.findCategoryByName(categoryName));

      if (foundCategory.rowCount > 0) {
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

      const isCategoryExists = allCategories.rows.some(category => category.category_name === categoryInfo.name);

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
      return allCategories.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Deletes a product category
   * @static
   * @param {number} categoryId Category Id to be deleted
   * @returns {boolean} Result of the operation
   * @memberof CategoryHelper
   */
  static async deleteCategory(categoryId) {
    try {
      const foundCategory = await pool.query(query.findCategoryById(categoryId));
      if (foundCategory.rows.length < 1) {
        errorHandler(404, 'Category not found');
      }
      await pool.query(query.deleteCategory(categoryId));
      return 'Category deleted successfully.';
    } catch (error) {
      return error;
    }
  }
}

export default CategoryHelper;
