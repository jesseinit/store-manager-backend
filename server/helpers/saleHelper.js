import sales from '../models/sales';

/**
 *
 *
 * @class SalesHelper
 */
class SalesHelper {
  /**
   *
   *
   * @static
   * @returns
   * @memberof SalesHelper
   */
  static getAllSales() {
    return sales;
  }

  /**
   *
   * @description Retirve a single sale with the passed id
   * @static
   * @param {number} saleId Sale Id to be retrieved
   * @returns
   * @memberof SalesHelper
   */
  static getSingleSale(saleId) {
    const saleRecord = [];
    sales.forEach(sale => {
      if (sale.id === saleId) {
        saleRecord.push(sale);
      }
    });
    return saleRecord;
  }
}

export default SalesHelper;
