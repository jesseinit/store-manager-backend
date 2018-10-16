import SalesHelper from '../helpers/saleHelper';

/**
 *
 * @description Represents blueprint of methods that gets or mutates store sales
 * @class Sales
 */
class SalesController {
  /**
   *
   * @description Retrieves all the sales from the data source
   * @returns {object} Returned sales array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static getAllProducts(req, res) {
    const sales = SalesHelper.getAllSales();
    res.status(200).json({ result: sales });
  }

  /**
   *
   * @description Retrieves a single sale record from the data source
   * @returns {object} Returned sale array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static getSingleSale(req, res) {
    const saleId = parseInt(req.params.id, 10);
    const sale = SalesHelper.getSingleSale(saleId);
    if (!sale.length) {
      res.status(404).json({ message: 'Sale Record not found' });
      return;
    }
    res.status(200).json({ result: sale });
  }
}
export default SalesController;
