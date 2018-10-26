import 'babel-polyfill';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import UserHelper from '../helpers/userHelper';
import pool from '../utils/connection';
import query from '../utils/queries';

dotenv.config();

const SECRET_KEY = process.env.JWT_KEY;

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
    const { userid, password } = req.body;
    const foundUser = await pool.query(query.findUser(userid));

    if (foundUser.rows.length < 1) {
      res.status(404).send({ status: false, message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.rows[0].password);
    if (!isPasswordValid) {
      res.status(401).send({ status: false, message: 'Authenication Failed' });
      return;
    }

    const token = jwt.sign(
      {
        id: foundUser.rows[0].userid,
        name: foundUser.rows[0].name,
        role: foundUser.rows[0].role
      },
      SECRET_KEY
    );

    res.status(200).json({ status: true, token });
  }
}

export default UserController;
