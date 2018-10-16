import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Store Manager', () => {
  describe('App', () => {
    it('It should catch and respond to undefined routes', done => {
      chai
        .request(app)
        .get('/*')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done(err);
        });
    });
  });

  describe('Products', () => {
    describe('GET /products', () => {
      it('Users should be able to get all product', done => {
        chai
          .request(app)
          .get('/api/v1/products/')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done(err);
          });
      });
    });

    describe('GET /products/:id', () => {
      it('Invalid product id should return an unprocessable input error', done => {
        chai
          .request(app)
          .get('/api/v1/products/*')
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('Non-existing product id should return a not found error when fetching product', done => {
        chai
          .request(app)
          .get('/api/v1/products/5')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.not.have.property('result');
            done(err);
          });
      });

      it('Valid product id should return the matching product', done => {
        chai
          .request(app)
          .get('/api/v1/products/1')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('result');
            expect(res.body.result).to.have.length(1);
            done(err);
          });
      });
    });

    describe('POST /products', () => {
      it('Invalid product id should return an unprocessable input error', done => {
        chai
          .request(app)
          .post('/api/v1/products')
          .send({
            imgUrl: 1027,
            name: '32inch LED Television',
            category: 'Electronics',
            price: '78900',
            qty: 0
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('Admin should be able to create a product', done => {
        chai
          .request(app)
          .post('/api/v1/products')
          .send({
            imgUrl: 'https://example.com/tv.jpg',
            name: '32inch LED Television',
            category: 'Electronics',
            price: 78900,
            qty: 5
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('result');
            expect(res.body.result).to.have.length(1);
            expect(res.body.result[0]).to.have.all.keys(
              'id',
              'imgUrl',
              'name',
              'category',
              'price',
              'qty'
            );
            done(err);
          });
      });
    });

    describe('PUT /products/:id', () => {
      it('Invalid product details information should return an unprocessable input error during product update', done => {
        chai
          .request(app)
          .put('/api/v1/products/5')
          .send({
            imgUrl: 1027,
            name: '32inch LED Television',
            category: 'Electronics',
            price: '78900',
            qty: 0
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('Non-existing product id should return a not found error during product update', done => {
        chai
          .request(app)
          .put('/api/v1/products/10')
          .send({
            imgUrl: 'https://example.com/tv.jpg',
            name: '32inch LED Television',
            category: 'Electronics',
            price: 78900,
            qty: 5
          })
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done(err);
          });
      });

      it('Product should update with same product details when there are no input errors', done => {
        chai
          .request(app)
          .put('/api/v1/products/5')
          .send({
            imgUrl: 'https://example.com/tv.jpg',
            name: '32inch LED Television',
            category: 'Electronics',
            price: 78900,
            qty: 5
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done(err);
          });
      });

      it('Product should update with different product details when there are no input errors', done => {
        chai
          .request(app)
          .put('/api/v1/products/5')
          .send({
            imgUrl: 'https://example.com/tv1.jpg',
            name: '42inch LED Television',
            category: 'Electronics.',
            price: 77900,
            qty: 6
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done(err);
          });
      });
    });

    describe('DELETE /products/:id', () => {
      it('Non-existing product id should return a not found error when trying to delete a proudct', done => {
        chai
          .request(app)
          .del('/api/v1/products/10')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done(err);
          });
      });

      it('Admin should be able to delete a product after passing a product id that exist', done => {
        chai
          .request(app)
          .del('/api/v1/products/5')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done(err);
          });
      });
    });
  });

  describe('Sales', () => {
    describe('GET /sales', () => {
      it('Admin should be able to retrieve all sales made in the store', done => {
        chai
          .request(app)
          .get('/api/v1/sales/')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            done(err);
          });
      });
    });

    describe('GET /sales/:id', () => {
      it('Invalid sales id should return an unprocessable input error', done => {
        chai
          .request(app)
          .get('/api/v1/sales/*')
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('Non-existing sales id should return a not found error when fetching a sale', done => {
        chai
          .request(app)
          .get('/api/v1/sales/5')
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body).to.not.have.property('result');
            done(err);
          });
      });

      it('Existing sale id should return the matching sale record', done => {
        chai
          .request(app)
          .get('/api/v1/sales/1')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('result');
            expect(res.body.result).to.have.length(1);
            done(err);
          });
      });
    });

    describe('POST /sales', () => {
      it('Invalid product id should return an unprocessable input error', done => {
        chai
          .request(app)
          .post('/api/v1/sales')
          .send({
            id: 0,
            name: '32inch LED Television',
            price: '78900',
            qty: 0
          })
          .end((err, res) => {
            expect(res.status).to.equal(422);
            expect(res.body).to.have.property('error');
            done(err);
          });
      });

      it('It should not be able to process orders on unavalable products or enough stock', done => {
        chai
          .request(app)
          .post('/api/v1/sales')
          .send({
            id: 1,
            name: '32inch LED Television',
            price: 78900,
            qty: 14
          })
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done(err);
          });
      });

      it('Attendant should be able to create a sales record on product and update stock', done => {
        chai
          .request(app)
          .post('/api/v1/sales')
          .send({
            id: 1,
            name: '32inch LED Television',
            price: 78900,
            qty: 5
          })
          .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('result');
            done(err);
          });
      });
    });
  });
});
