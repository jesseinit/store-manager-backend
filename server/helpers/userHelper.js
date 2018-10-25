import 'babel-polyfill';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';

const SECRET_KEY = process.env.JWT_KEY;

/**
 *
 * @description Contains helper methods that interacts with the data persistence layer
 * @class AuthHelper
 */
class AuthHelper {
  /**
   *
   * @description Helper method that login a user
   * @static
   * @param {object} user User login information
   * @returns {string} created jwt token
   * @memberof AuthHelper
   */
  static async loginUser(user) {
    try {
      const { userid, password } = user;
      const foundUser = await pool.query(query.findUser(userid));

      if (foundUser.rows.length < 1) {
        errorHandler(404, 'User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.rows[0].password);
      if (!isPasswordValid) {
        errorHandler(401, 'Authenication Failed');
      }

      const token = jwt.sign(
        {
          id: foundUser.rows[0].userid,
          name: foundUser.rows[0].name,
          role: foundUser.rows[0].role
        },
        SECRET_KEY
      );

      return token;
    } catch (error) {
      return error;
    }
  }
}

export default AuthHelper;
