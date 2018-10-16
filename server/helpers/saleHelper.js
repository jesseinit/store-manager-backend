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

  static createSalesRecord(newSale) {
    const newSaleRecord = {
      id: sales[sales.length - 1].id + 1,
      date: Date.now(),
      imgUrl: newSale.img,
      productName: newSale.name,
      qty: newSale.qty,
      price: newSale.price,
      get total() {
        return this.qty * this.price;
      }
    };

    sales.push(newSaleRecord);
    return [newSaleRecord];
  }
}

export default SalesHelper;
