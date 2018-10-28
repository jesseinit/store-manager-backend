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

  /**
   *
   * @description Gets all registered users in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {array} List of all users
   * @memberof UserController
   */
  static async getAllUsers(req, res, next) {
    const result = await UserHelper.getAllUsers();
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, result });
  }

  /**
   *
   * @description Modify user's information
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {object} Updated user object
   * @memberof UserController
   */
  static async updateUser(req, res, next) {
    const userRole = req.user.role;
    const { userid } = req.params;
    const { name, password, role } = req.body;
    const result = await UserHelper.updateUser({ userid, name, password, role, userRole });
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, result });
  }

  /**
   *
   * @description Deletes a  user's account
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {boolean} Result of the operation
   * @memberof UserController
   */
  static async deleteUser(req, res, next) {
    const { userid } = req.params;
    const result = await UserHelper.deleteUser(userid);
    if (result instanceof Error) {
      next(result);
      return;
    }
    res.status(200).json({ status: true, result });
  }
}

export default UserController;
