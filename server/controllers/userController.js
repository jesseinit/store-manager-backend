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
}

export default UserController;
