const sales = [
  {
    id: 1,
    date: Date.now(),
    productName: 'Television',
    qty: 5,
    price: 10,
    get total() {
      return this.qty * this.price;
    }
  }
];

export default sales;
