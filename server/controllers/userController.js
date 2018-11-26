import UserHelper from '../helpers/userHelper';
import handleResponse from '../utils/responseHandler';

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
    const result = await UserHelper.loginUser(req.body);
    handleResponse(result, next, res, 200, 'success', 'Login successfully');
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
    handleResponse(result, next, res, 201, 'success', 'User created successfully');
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
    handleResponse(result, next, res, 200, 'success', 'Users retrieved successfully');
  }

  /**
   *
   * @description Retrieves a single registered user account in the store
   * @static
   * @param {object} req Request Object
   * @param {object} res Response Object
   * @param {object} next calls the next middleware in the request-response cycle
   * @returns {object} A user account information
   * @memberof UserController
   */
  static async getSingleUsers(req, res, next) {
    const { userid } = req.params;
    const result = await UserHelper.getSingleUser(Number(userid));
    handleResponse(result, next, res, 200, 'success', 'User retrieved successfully');
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
    handleResponse(result, next, res, 200, 'success', 'User updated successfully');
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
    handleResponse(result, next, res, 200, 'success', result);
  }
}

export default UserController;
