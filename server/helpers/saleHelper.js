import sales from '../models/sales';
import ProductHelper from './productHelper';

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
  static getAllSales() {
    return sales;
  }

  /**
   *
   * @description Retirves a single sale record with the passed id
   * @static
   * @param {number} saleId Sale Id to be retrieved
   * @returns {object} An object of the found sales record or empty object if not found
   * @memberof SalesHelper
   */
  static getSingleSale(saleId) {
    let foundRecord = {};
    sales.forEach(sale => {
      if (sale.id === saleId) {
        foundRecord = sale;
      }
    });
    return foundRecord;
  }

  /**
   * @description Helper method that creates a sales record
   * @returns {object} Created sales record object
   * @static
   * @param {object} - sales record object to be created
   * @memberof SalesHelper
   */
  static createSalesRecord(newSale) {
    const foundProduct = ProductHelper.getSingleProduct(newSale.id);
    const newSaleRecord = {
      id: sales[sales.length - 1].id + 1,
      date: Date.now(),
      productName: foundProduct.name,
      price: foundProduct.price,
      qty: newSale.qty,
      get total() {
        return this.qty * this.price;
      }
    };
    sales.push(newSaleRecord);
    return newSaleRecord;
  }
}

export default SalesHelper;
