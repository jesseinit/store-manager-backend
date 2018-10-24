const rules = {
  paramsIdRules: req => {
    if (/^([1-9]+|[1-9][0-9]+)$/.test(req.params.id) === false) {
      req.validationErrors.push('Product ID must be a positve integer from 1');
    }
  },
  saleIdRules: req => {
    if (/^([1-9]+|[1-9][0-9]+)$/.test(req.params.id) === false) {
      req.validationErrors.push('Sales Order ID must be a positve integer from 1');
    }
  },
  productIdRules: req => {
    if (/^([1-9]+|[1-9][0-9]+)$/.test(req.body.id) === false || !req.body.id) {
      req.validationErrors.push('Product ID must be a positve integer from 1');
    }
  },
  productImgRules: req => {
    if (
      /(http(s?):)([/.\w\s-])*\.(?:jpg|gif|png)/g.test(req.body.imgUrl) === false ||
      !req.body.imgUrl
    ) {
      req.validationErrors.push('Image Input should be a valid image url');
    }
  },
  productNameRules: req => {
    if (/^(\S)[a-zA-Z0-9+-.:\s"]+/g.test(req.body.name) === false || !req.body.name) {
      req.validationErrors.push('Product name must be a string with atlease 2 letters');
    }
    req.body.name = req.body.name.replace(/\s\s+/g, ' ').trim();
  },
  productCategoryRules: req => {
    if (/^(\D)[a-zA-Z\s]+/g.test(req.body.category) === false || !req.body.category) {
      req.validationErrors.push(
        'Category should not start with spaces and must contain atleast 2 letters'
      );
    }
    req.body.category = req.body.category.replace(/\s\s+/g, ' ').trim();
  },
  productPriceRules: req => {
    if (/\d+(\.\d{1,2})?/.test(req.body.price) === false || !req.body.price) {
      req.validationErrors.push('Price must be a number from 1.00');
    }
  },
  productQtyRules: req => {
    if (/^([1-9]+|[1-9][0-9]+)$/.test(req.body.qty) === false || !req.body.qty) {
      req.validationErrors.push('Price must be a number from 1');
    }
  }
};

const validateProductId = (req, res, next) => {
  rules.paramsIdRules(req);
  next();
};

const validateSaleId = (req, res, next) => {
  rules.saleIdRules(req);
  next();
};

const validateNewProduct = (req, res, next) => {
  rules.productImgRules(req);
  rules.productNameRules(req);
  rules.productCategoryRules(req);
  rules.productPriceRules(req);
  rules.productQtyRules(req);
  next();
};

const validateProductUpdate = (req, res, next) => {
  rules.paramsIdRules(req);
  rules.productImgRules(req);
  rules.productNameRules(req);
  rules.productCategoryRules(req);
  rules.productPriceRules(req);
  rules.productQtyRules(req);
  next();
};

const validateNewSale = (req, res, next) => {
  rules.productIdRules(req);
  rules.productQtyRules(req);
  next();
};

const validationHandler = (req, res, next) => {
  if (req.validationErrors.length) {
    res.status(422).json({ error: req.validationErrors });
  } else {
    next();
  }
};

const validations = {
  validateSaleId,
  validateNewSale,
  validateProductUpdate,
  validateNewProduct,
  validateProductId,
  validationHandler
};
export default validations;
