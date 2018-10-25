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
  static async loginUser(req, res) {
    try {
      const result = await UserHelper.loginUser(req.body);
      if (result instanceof Error) {
        throw result;
      }
      res.status(200).json({ status: true, token: result });
    } catch (error) {
      res.status(error.status || 500).json({ status: false, message: error.message });
    }
  }
}

export default UserController;
