import 'babel-polyfill';
import UserHelper from '../helpers/userHelper';

/**
 *
 * @description Represent a collection of route handlers
 * @class UserController
 */
class UserController {
  /**
   *
   * @description Login the user and send a token response
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next Calles the next middleware in the request-response cycle
   * @returns {string} User token
   * @memberof UserController
   */
  static async loginUser(req, res, next) {
    const { userid, password } = req.body;
    const result = await UserHelper.loginUser({ userid, password });
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, token: result });
  }

  /**
   *
   * @description Create a new user in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {string} User token
   * @memberof UserController
   */
  static async createUser(req, res, next) {
    const result = await UserHelper.createUser(req.body);
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(201).json({ status: true, result });
  }
}

export default UserController;
