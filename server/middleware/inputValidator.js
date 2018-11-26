import { body, param, query, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

const validateLogin = [
  body('email')
    .normalizeEmail({ all_lowercase: true })
    .custom(email => /(^[A-Za-z]+)(\.[a-zA-Z]+)?@storemanager.com$/.test(email))
    .withMessage('Invalid email address entered')
    .exists()
    .withMessage('A valid email must be provided.'),
  body('password')
    .exists()
    .withMessage('User password must be provided.')
    .isLength({ min: 5 })
    .withMessage('Password should be atleast 5 characters')
];

const validateSignup = [
  validateLogin[0],
  validateLogin[1],
  sanitizeBody('name').customSanitizer(value => value.replace(/\s\s+/g, ' ').trim()),
  body('name')
    .isLength({ min: 2 })
    .withMessage('Name must be atleast 2 characters long'),
  sanitizeBody('role').customSanitizer(value => value.charAt(0).toUpperCase() + value.slice(1)),
  body('role')
    .isIn(['Admin', 'Attendant'])
    .withMessage('User can either be an Admin or Attendant'),
  body('name')
    .exists()
    .withMessage('Please provide a name')
];

const validateUserId = [
  param('userid')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positve integer from 1')
];

const validateUserUpdate = [
  param('userid')
    .isInt({ min: 1 })
    .withMessage('User ID must be a positve integer from 1'),
  body('password')
    .optional()
    .isLength({ min: 5 })
    .withMessage('Password should be atleast 5 characters'),
  validateSignup[2],
  validateSignup[3].optional(),
  validateSignup[4],
  body('role')
    .optional()
    .isIn(['Admin', 'Attendant'])
    .withMessage('User can either be an Admin or Attendant')
];

const validateUserDelete = [validateUserUpdate[0]];

const validateNewCategory = [
  sanitizeBody('name').customSanitizer(value =>
    value
      .replace(/([^a-zA-z\s])/g, '')
      .toLowerCase()
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  ),
  body('name')
    .exists()
    .withMessage('Please provide a category name')
    .isString()
    .withMessage('Category name should be a string.')
    .isLength({ min: 2 })
    .withMessage('Category name must be atleast 2 letters long')
];

const validateUpdateCategory = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positve number from 1'),
  validateNewCategory[0],
  validateNewCategory[1]
];

const validateCategoryId = [validateUpdateCategory[0]];

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
      const checkUrl = /(http(s?):(\/){2})([^/])([/.\w\s-])*\.(?:jpg|gif|png)/g;
      return checkUrl.test(imageUrl);
    })
    .withMessage('Product image input should be a valid image url'),
  body('name')
    .isLength({ min: 2 })
    .withMessage('Product name must be 2 letters long'),
  body('categoryid')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive number from 1'),
  body('price')
    .isFloat({ min: 1.0 })
    .withMessage('Product price must be decimal number of 1.0 or more'),
  body('qty')
    .isInt({ min: 1 })
    .withMessage('Product qty must be a positive number from 1'),
  body('imgUrl')
    .exists()
    .withMessage('Product Image must be provided.'),
  sanitizeBody('name').customSanitizer(value => value.replace(/\s{2,}/g, ' ').trim()),
  body('name')
    .exists()
    .withMessage('Product name must be provided.'),
  body('categoryid')
    .exists()
    .withMessage('Category Id must be provided.'),
  body('price')
    .exists()
    .withMessage('Product price must  be provided.'),
  body('qty')
    .exists()
    .withMessage('Product quantity must be provided.')
];

const validateProductUpdate = [
  validateProductId[0],
  validateNewProduct[0].optional(),
  validateNewProduct[1].optional(),
  validateNewProduct[2].optional(),
  validateNewProduct[3].optional(),
  validateNewProduct[4].optional()
];

const valaidateGetProducts = [
  query('limit')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Limit must be from 1 and above'),
  query('page')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Page must be from 1 and above'),
  query('catId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Category Id must be a number from 1 and above'),
  query('stock')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Quantity must be from a number 1 and above')
];

const valaidateGetSales = [
  valaidateGetProducts[0],
  valaidateGetProducts[1],
  query('fdate')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  query('tdate')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  query('userid')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('User ID must be greater than zero')
];

const validateNewSale = [
  body('products', 'Products must exists').exists(),
  body('products', 'Products must be specified in the right format').isArray(),
  body('products', 'Products must have atleast an entry').isLength({ min: 1 }),
  body('products.*.id', 'Product Id must be a a number from 1').isInt({ min: 1 }),
  body('products.*.qty', 'Product Qty must be a number from 1').isInt({ min: 1 })
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
  validateSignup,
  validateUserId,
  validateUserUpdate,
  validateUserDelete,
  validateNewCategory,
  validateUpdateCategory,
  validateCategoryId,
  validateSaleId,
  validateNewSale,
  validateProductUpdate,
  validateNewProduct,
  validateProductId,
  valaidateGetProducts,
  valaidateGetSales,
  validationHandler
};
export default validations;
