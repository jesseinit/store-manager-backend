import SalesHelper from '../helpers/saleHelper';
import isEmptyObject from '../utils/isEmptyObject';
import handleResponse from '../utils/responseHandler';

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
  static async getAllSales(req, res, next) {
    const result = await SalesHelper.getAllSales();
    handleResponse(result, next, res);
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
  static async createNewSale(req, res, next) {
    const userid = req.user.id;
    const { products } = req.body;
    const { total } = req;
    const result = await SalesHelper.createNewSale({ userid, total, products });
    handleResponse(result, next, res, 201);
  }
}
export default SalesController;
