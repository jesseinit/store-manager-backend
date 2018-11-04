import SalesHelper from '../helpers/saleHelper';
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
  static async getSingleSale(req, res, next) {
    const saleId = parseInt(req.params.id, 10);
    const result = await SalesHelper.getSingleSale(saleId, req.user);
    handleResponse(result, next, res);
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
    handleResponse(result, next, res, 201, 'success', 'Sale created successfully');
  }
}
export default SalesController;
