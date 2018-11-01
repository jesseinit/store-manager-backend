import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import errorHandler from '../utils/errorHandler';

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'undefined') {
    errorHandler(401, 'Unauthorised - Header Not Set');
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
    if (err) {
      errorHandler(401, err);
    }
    req.user = decodedToken;
    next();
  });
};

const attendantOnly = (req, res, next) => {
  const { role } = req.user;
  if (role === 'Attendant') {
    next();
    return;
  }
  errorHandler(403, 'You cant perform this action. Attendants Only');
};

const adminOnly = (req, res, next) => {
  const { role } = req.user;
  if (role === 'Attendant') {
    errorHandler(403, 'You cant perform this action. Admins Only');
  }
  next();
};

const ownerOnly = (req, res, next) => {
  const { role } = req.user;
  if (role === 'Attendant' || role === 'Admin') {
    errorHandler(403, 'You cant perform this action. Owner account Only');
  }
  next();
};

export default { verifyToken, adminOnly, attendantOnly, ownerOnly };
