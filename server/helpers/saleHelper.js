import ProductHelper from './productHelper';
import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';
import { paginatedResult, paginateEmptyResult } from '../utils/paginateRecords';

/**
 *
 * @description Helper class that handles request to the data store
 * @class SalesHelper
 */
class SalesHelper {
  /**
   *
   * @description Helper method that gets all sales records from the data source
   * @static
   * @returns {array} An array of sales records objects
   * @memberof SalesHelper
   */
  static async getAllSales(request) {
    const { page } = request;

    const { rowCount } = await pool.query(query.getAllSalesCount());

    if (!rowCount) {
      return paginateEmptyResult('No sales made yet.');
    }

    const limit = Number(request.limit) || 10;

    let currentPage = Number(page) || 1;

    const totalPages = Math.ceil(rowCount / limit);

    /* istanbul ignore next */
    if (currentPage > totalPages) currentPage = totalPages;

    const offset = (currentPage - 1) * limit;

    const { rows } = await pool.query(query.getAllSales(limit, offset));

    return paginatedResult(rows, totalPages, currentPage);
  }

  /**
   *
   * @description Helper method that gets miscelaneous information for admin dashboard
   * @static
   * @returns {array} An array of sales records objects
   * @memberof SalesHelper
   */
  static async getMisc() {
    const result = await Promise.all([
      pool.query(query.getTotalProdWorth()),
      pool.query(query.getTotalProductSold()),
      pool.query(query.getTotalSaleOrders()),
      pool.query('select * from products'),
      pool.query('select * from category'),
      pool.query('select * from users'),
      pool.query(query.getLastFiveSales())
    ]);

    const misc = {
      totalproductworth: result[0].rows[0].total_products_worth,
      totalproductsold: Number(result[1].rows[0].total_products_sold),
      totalsaleorder: result[2].rowCount,
      totalproducts: result[3].rowCount,
      totalcategory: result[4].rowCount,
      totalemployee: result[5].rowCount,
      latestsales: result[6].rows
    };

    return { misc };
  }

  /**
   *
   * @description Helper method that gets miscelaneous information for attendant dashboard
   * @static
   * @returns {array} An array of sales records objects
   * @memberof SalesHelper
   */
  static async getMiscForAttendant(userid) {
    const result = await Promise.all([
      pool.query(query.getTotalProdWorthAttendant(userid)),
      pool.query(query.getTotalProductSoldAttendant(userid)),
      pool.query(query.getTotalSaleOrdersAttendant(userid))
    ]);

    const misc = {
      totalproductworth: result[0].rows[0].total_products_worth,
      totalproductsold: Number(result[1].rows[0].total_products_sold),
      totalsaleorder: result[2].rowCount
    };

    return { misc };
  }

  /**
   *
   * @description Helper method that gets all sales records from within a period
   * @static
   * @returns {array} An array of sales records objects
   * @memberof SalesHelper
   */
  static async getAllSalesByDate(request) {
    const { page, fdate, tdate } = request;

    const { rowCount } = await pool.query(query.getAllSalesByDateCount(fdate, tdate));

    if (!rowCount) {
      return paginateEmptyResult('No records within this period');
    }

    const limit = Number(request.limit) || 10;

    let currentPage = Number(page) || 1;

    const totalPages = Math.ceil(rowCount / limit);

    /* istanbul ignore next */
    if (currentPage > totalPages) currentPage = totalPages;

    const offset = (currentPage - 1) * limit;

    const { rows } = await pool.query(query.getAllSalesByDate(fdate, tdate, limit, offset));

    const result = paginatedResult(rows, totalPages, currentPage);

    return result;
  }

  /**
   *
   * @description Helper method that gets all sales records made by an attendant
   * @static
   * @returns {array} An array of sales records objects
   * @memberof SalesHelper
   */
  static async getAllSalesByAttendant(request) {
    const { page, userid } = request;

    const { rowCount } = await pool.query(query.getAllSalesByAttendantCount(userid));

    if (!rowCount) {
      return paginateEmptyResult('You have not made any sales yet.');
    }

    const limit = Number(request.limit) || 10;

    let currentPage = Number(page) || 1;

    const totalPages = Math.ceil(rowCount / limit);

    /* istanbul ignore next */
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const offset = (currentPage - 1) * limit;

    const { rows } = await pool.query(query.getAllSalesByAttendant(userid, limit, offset));

    const result = paginatedResult(rows, totalPages, currentPage);

    return result;
  }

  /**
   *
   * @description Retirves a single sale record with the passed id
   * @static
   * @param {number} saleId Sale Id to be retrieved
   * @param {string} role User Role
   * @returns {object} An object of the found sales record or empty object if not found
   * @memberof SalesHelper
   */
  static async getSingleSale(saleId, userInfo) {
    try {
      const foundSale = await pool.query(query.getSingleSaleAdmin(saleId));
      if (foundSale.rowCount < 1) {
        errorHandler(404, 'Sale record not found');
      }

      if (userInfo.role === 'Attendant') {
        const attendantSale = await pool.query(query.getSingleSaleUser(userInfo.id, saleId));
        if (!attendantSale.rowCount) {
          errorHandler(404, 'Sale record not found or not made by you');
        }
        return attendantSale.rows;
      }

      return foundSale.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   * @description Helper method that creates a sales record
   * @returns {object} Created sales record object
   * @static
   * @param {object} - sales record object to be created
   * @memberof SalesHelper
   */
  static async createNewSale(newSale) {
    try {
      const { userid, total, products } = newSale;
      const { rows } = await pool.query(query.createSale(userid, total));
      const saleId = rows[0].sale_id;

      products.forEach(async product => {
        const foundRecord = await ProductHelper.getProductById(product.id);

        const productWorth = foundRecord.product_price * product.qty;
        const newProductQty = foundRecord.product_qty - product.qty;

        await pool.query(query.createProductSales(product.id, saleId, productWorth, product.qty));

        await pool.query(query.updateProduct(product.id, { price: foundRecord.product_price, qty: newProductQty }));
      });

      const thisSale = await pool.query(query.thisSale(saleId));
      return thisSale.rows;
    } catch (error) {
      return error;
    }
  }
}

export default SalesHelper;
