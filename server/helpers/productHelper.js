import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';
import { paginatedResult, paginateEmptyResult } from '../utils/paginateRecords';
import { uploadImage } from '../utils/imageUploadHandler';

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
  static async allProducts({ limit, page }) {
    const { rowCount } = await pool.query(query.getAllProductsCount());

    if (!rowCount) return paginateEmptyResult('You have not created products yet.');

    const limitBy = Number(limit) || 12;
    let currentPage = Number(page) || 1;
    const totalPages = Math.ceil(rowCount / limitBy);

    /* istanbul ignore next */
    if (currentPage > totalPages) currentPage = totalPages;

    const offset = (currentPage - 1) * limitBy;
    const { rows } = await pool.query(query.getAllProducts(limitBy, offset));

    const result = paginatedResult(rows, totalPages, currentPage);
    return result;
  }

  /**
   *
   * @description Helps to retrieve products based on their category
   * @static
   * @returns {array} An array of products objects
   * @memberof ProductHelper
   */
  static async allProductsByCategory({ search, catid, page }) {
    const { rowCount } = await pool.query(query.getAllProductsByCategoryCount(catid, search));

    if (!rowCount) return paginateEmptyResult('No product matches your search.');

    let currentPage = Number(page) || 1;
    const totalPages = Math.ceil(rowCount / 12);

    /* istanbul ignore next */
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const offset = (currentPage - 1) * 12;

    const { rows } = await pool.query(query.getAllProductsByCategory(catid, search, offset));

    const result = paginatedResult(rows, totalPages, currentPage);

    return result;
  }

  /**
   *
   * @description Helps to retrieve products based on their name
   * @static
   * @returns {array} An array of products objects
   * @memberof ProductHelper
   */
  static async allProductsByName(request) {
    const { search, page } = request;

    const { rowCount } = await pool.query(query.getAllProductsByNameCount(search));

    if (!rowCount) {
      return paginateEmptyResult('No product matches your search.');
    }

    let currentPage = Number(page) || 1;

    const totalPages = Math.ceil(rowCount / 12);

    /* istanbul ignore next */
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const offset = (currentPage - 1) * 12;

    const { rows } = await pool.query(query.getAllProductsByName(search, offset));

    const result = paginatedResult(rows, totalPages, currentPage);
    return result;
  }

  /**
   *
   * @description Filter products by remaining stock
   * @static
   * @returns {array} An array of products objects
   * @memberof ProductHelper
   */
  static async allProductsByStock(request) {
    const { page, stock } = request;

    const { rowCount } = await pool.query(query.filterAllProductsByStockCount(stock));

    if (!rowCount) {
      return paginateEmptyResult('No product matches your search.');
    }

    let currentPage = Number(page) || 1;

    const totalPages = Math.ceil(rowCount / 10);

    /* istanbul ignore next */
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const offset = (currentPage - 1) * 10;

    const { rows } = await pool.query(query.filterAllProductsByStock(stock, offset));

    const result = paginatedResult(rows, totalPages, currentPage);
    return result;
  }

  /**
   *
   * @description Helper method that gets a single product's represenation
   * @static
   * @returns {object} An object of the found product or empty object if not found
   * @param {number} prodId Id of the product to be retrieved
   * @memberof ProductHelper
   */
  static async getProductById(prodId) {
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
      const {
        file,
        body: { name, categoryid, price, qty }
      } = newProduct;

      const foundCategory = await pool.query(query.findCategoryById(categoryid));
      if (foundCategory.rowCount < 1) {
        errorHandler(400, 'The category does not exit');
      }

      const allProducts = await pool.query(query.getAllProducts());
      const isExists = allProducts.rows.some(product => product.product_name === name);

      if (isExists) {
        errorHandler(400, 'The provided product name already exists.');
      }

      const productInfo = {
        imgUrl: file
          ? await uploadImage(file)
          : 'https://res.cloudinary.com/jesseinit/image/upload/v1544027864/sample.jpg',
        name,
        categoryid,
        price,
        qty
      };
      const createdProduct = await pool.query(query.createProduct(productInfo));
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
  static async updateProduct(productInfo) {
    try {
      const thisProduct = await this.getProductById(productInfo.id);
      if (thisProduct instanceof Error) {
        return thisProduct;
      }

      if (thisProduct.product_name !== productInfo.body.name) {
        const allProducts = await pool.query(query.getAllProductsCount());

        const isExists = allProducts.rows.some(product => product.product_name === productInfo.body.name);
        if (isExists) {
          errorHandler(400, 'The provided product name already exists.');
        }
      }

      const foundCategory = await pool.query(query.findCategoryById(productInfo.body.categoryid));

      if (foundCategory.rowCount < 1) {
        errorHandler(400, 'The category does not exist.');
      }

      const updateData = {
        id: productInfo.id,
        imageUrl: productInfo.file ? await uploadImage(productInfo.file) : thisProduct.product_image,
        name: productInfo.body.name,
        price: productInfo.body.price,
        qty: productInfo.body.qty,
        categoryid: productInfo.body.categoryid
      };

      const updatedProduct = await pool.query(query.updateProduct(updateData));

      return updatedProduct.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that delete a product and mutates the data structure
   * @static
   * @param {number} prodId Product ID of the product to be deleted
   * @returns {boolean} Boolean to confirm product deletion or failure
   * @memberof ProductHelper
   */
  static async deleteProduct(productid) {
    try {
      const thisProduct = await this.getProductById(productid);
      if (thisProduct instanceof Error) {
        return thisProduct;
      }

      await pool.query(query.deleteProduct(productid));
      return [];
    } catch (error) {
      return error;
    }
  }
}

export default ProductHelper;
