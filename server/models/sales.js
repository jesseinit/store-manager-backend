const sales = [
  {
    id: 1,
    date: Date.now(),
    productName: 25,
    qty: 5,
    price: 10,
    get total() {
      return this.qty * this.price;
    }
  }
];

export default sales;
