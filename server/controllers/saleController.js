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
   * @description Retrieves all the sales from the database - Admins Only
   * @returns {array} Returns all sales records as an array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static async getAllSales(req, res) {
    if (req.query.misc === 'true') {
      const result = await SalesHelper.getMisc();
      res.send(result);
      return;
    }

    if (req.query.fdate && req.query.tdate) {
      const result = await SalesHelper.getAllSalesByDate(req.query);
      res.send(result);
      return;
    }

    if (req.query.userid) {
      const result = await SalesHelper.getAllSalesByAttendant(req.query);
      res.send(result);
      return;
    }

    const result = await SalesHelper.getAllSales(req.query);
    res.send(result);
  }

  /**
   *
   * @description Retrieves all the sales made by a user - Attendants Only
   * @returns {array} Returns all sales records as an array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof Sales
   */
  static async getAllSalesUser(req, res) {
    const { id } = req.user;
    req.query.userid = id;

    if (req.query.misc === 'true') {
      const result = await SalesHelper.getMiscForAttendant(id);
      res.send(result);
      return;
    }

    /* TODO: Implement Date Filter for Attendant */

    const result = await SalesHelper.getAllSalesByAttendant(req.query);
    res.send(result);
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
    handleResponse(result, next, res, 200, 'success', 'Sale retrieved successfully');
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
    handleResponse(result, next, res, 201, 'success', 'Checkout completed successfully');
  }
}
export default SalesController;
