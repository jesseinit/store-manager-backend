import SalesHelper from '../helpers/saleHelper';

class Sales {
  static getAllProducts(req, res) {
    const sales = SalesHelper.getAllSales();
    res.status(200).json({ result: sales });
  }
}
export default Sales;
