import 'babel-polyfill';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../utils/connection';
import query from '../utils/queries';
import errorHandler from '../utils/errorHandler';

dotenv.config();
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
      const foundUser = await pool.query(query.findUser(user.userid));

      if (foundUser.rows.length < 1) {
        errorHandler(404, 'User not found');
      }

      const isPasswordValid = await bcrypt.compare(user.password, foundUser.rows[0].password);
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

  /**
   *
   * @description Helper method that creates a new user in the store
   * @static
   * @param {object} user User registration information
   * @returns {object} the created user or an error object
   * @memberof UserHelper
   */
  static async createUser(user) {
    try {
      const { name, password, role } = user;
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await pool.query(query.regUser(name, hashedPassword, role));
      return createdUser.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that gets all users from the database
   * @static
   * @returns {array} List of users
   * @memberof UserHelper
   */
  static async getAllUsers() {
    try {
      const users = await pool.query(query.getAllUsers());
      return users.rows;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that creates a new user in the store
   * @static
   * @param {object} user User registration information
   * @returns {object} the created user or an error object
   * @memberof UserHelper
   */
  static async updateUser(user) {
    try {
      const { userid, name, password, role, userRole } = user;

      const { rows } = await pool.query(query.findUser(userid));

      if (rows.length < 1) {
        errorHandler(404, 'User not found');
      }

      const foundUser = rows[0];

      if (userRole === 'Admin' && foundUser.role === 'Owner') {
        errorHandler(403, 'Admin cant update owner account');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await pool.query(query.updateUser(name, hashedPassword, role, userid));
      return updatedUser.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @description Helper method that deletes a user from the database
   * @static
   * @param {number} userid User Id to be deleted
   * @returns {boolean} Result of the operation
   * @memberof UserHelper
   */
  static async deleteUser(userid) {
    try {
      const { rows } = await pool.query(query.findUser(userid));
      if (rows.length < 1) {
        errorHandler(404, 'User not found');
      }
      const foundUser = rows[0];
      if (foundUser.role === 'Owner') {
        errorHandler(403, 'Store owner account cant be deleted');
      }
      await pool.query(query.deleteUser(foundUser.userid));
      return 'User has been deleted successfully';
    } catch (error) {
      return error;
    }
  }
}

export default AuthHelper;
