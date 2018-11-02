import ProductHelper from './productHelper';
import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';

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
  static async getAllSales() {
    const allSales = await pool.query(query.getAllSales());
    if (allSales.rowCount < 1) {
      return 'No sales has been made yet.';
    }
    return allSales.rows;
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
        return attendantSale.rows[0];
      }

      return foundSale.rows[0];
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

        const totalPerProduct = foundRecord.price * product.qty;
        const newProductQty = foundRecord.qty - product.qty;

        await pool.query(query.createProductSales(product.id, saleId, totalPerProduct, product.qty));

        await pool.query(
          query.updateProduct(product.id, { price: foundRecord.price, qty: newProductQty })
        );
      });

      // Crreate new sale
      const thisSale = await pool.query(query.thisSale(saleId));
      return thisSale.rows;
    } catch (error) {
      return error;
    }
  }
}

export default SalesHelper;
