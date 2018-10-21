import ProductHelper from '../helpers/productHelper';

/**
 *
 * @description Represents blueprint of methods that gets or mutates store products
 * @class ProductController
 */
class ProductController {
  /**
   * @description Retrieves all the products from the data source
   * @returns {object} Returned products array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static getAllProducts(req, res) {
    const products = ProductHelper.allProducts();
    res.status(200).json({ result: products });
  }

  /**
   * @description Retrieves a single product from the data source
   * @returns {object} Returned product array
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static getSingleProduct(req, res) {
    const productId = parseInt(req.params.id, 10);
    const product = ProductHelper.getSingleProduct(productId);
    if (typeof product[0] === 'undefined') {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ result: product });
  }

  /**
   * @description Creates a new product
   * @returns {object} Created product
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static createProduct(req, res) {
    const newProduct = ProductHelper.createProduct(req.body);
    res.status(201).json({ result: newProduct });
  }

  /**
   * @description Updates a product
   * @returns {object} Updated product
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static updateProduct(req, res) {
    const id = parseInt(req.params.id, 10);
    const { imgUrl, name, category, price, qty } = req.body;
    const updatedProduct = ProductHelper.updateProduct({
      id,
      imgUrl,
      name,
      category,
      price,
      qty
    });
    if (!updatedProduct.length) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ result: updatedProduct });
  }

  /**
   * @description Deletes a product
   * @returns {boolean} Deletion status
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @memberof ProductController
   */
  static deleteProduct(req, res) {
    const productId = parseInt(req.params.id, 10);
    const isDeleted = ProductHelper.deleteProduct(productId);
    if (!isDeleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json({ message: 'Product deleted' });
  }
}

export default ProductController;
