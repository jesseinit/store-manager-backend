import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'undefined') {
    res.status(401).json({ status: false, error: 'Unauthorised - Header Not Set' });
    return;
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ status: false, error: 'Unauthorised - Authencation Error', err });
      return;
    }
    req.user = decodedToken;
    next();
  });
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin' || req.user.role !== 'Owner') {
    res.status(403).json({ status: false, error: 'You cant perform this action. Admins Only' });
    return;
  }
  next();
};

export default { verifyToken, adminOnly };
