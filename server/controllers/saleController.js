import SalesHelper from '../helpers/saleHelper';
import ProductHelper from '../helpers/productHelper';
import isEmptyObject from '../utils/isEmptyObject';

/**
 *
 * @description Represents blueprint of methods that gets or mutates store sales
 * @class Sales
 */
class SalesController {
  /**
   *
   * @description Retrieves all the sales from the data source
   * @returns {array} Returns all sales records as an array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static getAllSales(req, res) {
    const sales = SalesHelper.getAllSales();
    res.status(200).json({ status: true, result: sales });
  }

  /**
   *
   * @description Retrieves a single sale record from the data source
   * @returns {object} Returned sale record object
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static getSingleSale(req, res) {
    const saleId = parseInt(req.params.id, 10);
    const sale = SalesHelper.getSingleSale(saleId);
    if (isEmptyObject(sale)) {
      res.status(404).json({ status: false, message: 'Sale Record not found' });
      return;
    }
    res.status(200).json({ status: true, result: sale });
  }

  /**
   *
   * @description Creates a new sales record
   * @returns {object} Returns created sale record
   * @static
   * @param {*} req
   * @param {*} res
   * @memberof SalesController
   */
  static createNewSale(req, res) {
    const { id, qty } = req.body;
    const inStock = ProductHelper.inStock({ id, qty });
    if (inStock === false) {
      res.status(400).send({ status: false, message: 'Product or stock not available' });
      return;
    }
    const newSale = SalesHelper.createSalesRecord({ id, qty });
    ProductHelper.updateStock({ id, qty });
    res.status(201).send({ status: true, result: newSale });
  }
}
export default SalesController;
