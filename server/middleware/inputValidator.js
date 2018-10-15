import { param, validationResult } from 'express-validator/check';

const validateProductId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positve number from 1')
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array().map(error => error.msg) });
  } else {
    next();
  }
};

const validations = { validateProductId, validationHandler };
export default validations;
