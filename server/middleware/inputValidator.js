import { body, param, validationResult } from 'express-validator/check';

const validateLogin = [
  body('userid')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positve number from 1'),
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password should be atleast 5 characters')
];

const validateProductId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positve integer from 1')
];

const validateSaleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Sales Order ID must be a positve integer from 1')
];

const validateNewProduct = [
  body('imgUrl')
    .custom(imageUrl => {
      const checkUrl = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
      return checkUrl.test(imageUrl);
    })
    .withMessage('Image Input should be a valid image url'),
  body('name')
    .isString()
    .isLength({ min: 2 })
    .withMessage('Product name must be atlease 2 letters long'),
  body('category')
    .isString()
    .withMessage('Product category must be a string')
    .isLength({ min: 2 })
    .withMessage('Product name must be atlease 2 letters long'),
  body('price')
    .isFloat({ min: 1.0 })
    .withMessage('Product price must be decimal number of 1.0 or more'),
  body('qty')
    .isNumeric({ min: 1 })
    .withMessage('Product qty must be a positive number from 1')
];

const validateProductUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positve number from 1'),
  body('imgUrl')
    .custom(imageUrl => /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g.test(imageUrl))
    .withMessage('Image Input should be a valid image url'),
  body('name')
    .isString()
    .withMessage('Product name must be a string')
    .isLength({ min: 2 })
    .withMessage('Product name must be atlease 2 letters long'),
  body('category')
    .isString()
    .withMessage('Product category must be a string')
    .isLength({ min: 2 })
    .withMessage('Product name must be atlease 2 letters long'),
  body('price')
    .isInt({ min: 1 })
    .withMessage('Product price must be decimal number of 1 or more'),
  body('qty')
    .isInt({ min: 1 })
    .withMessage('Product qty must be a positive number from 1')
];

const validateNewSale = [
  body('id')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positve number from 1'),
  body('qty')
    .isInt({ min: 1 })
    .withMessage('Order qty must be a positive number from 1')
];

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: errors.array().map(error => error.msg) });
  } else {
    next();
  }
};

const validations = {
  validateLogin,
  validateSaleId,
  validateNewSale,
  validateProductUpdate,
  validateNewProduct,
  validateProductId,
  validationHandler
};
export default validations;
