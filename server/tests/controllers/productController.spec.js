import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import mockData from '../mock';

const { invalidProductEntry, validProductEntry } = mockData;

const { expect } = chai;
chai.use(chaiHttp);

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
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Product not found');
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.status).to.equal(false);
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
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal(true);
          expect(res.body.result).to.be.an('object');
          expect(res.body.result).to.have.keys(['id', 'imgUrl', 'name', 'category', 'price', 'qty']);
          done(err);
        });
    });
  });

  describe('POST /products', () => {
    it('Invalid product id should return an unprocessable input error', done => {
      chai
        .request(app)
        .post('/api/v1/products')
        .send(invalidProductEntry)
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
        .send(validProductEntry)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.be.an('object');
          expect(res.body.result).to.have.all.keys('id', 'imgUrl', 'name', 'category', 'price', 'qty');
          done(err);
        });
    });

    it('Admin should be able to create a product with the same product name', done => {
      chai
        .request(app)
        .post('/api/v1/products')
        .send(validProductEntry)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.status).to.equal(false);
          done(err);
        });
    });
  });

  describe('PUT /products/:id', () => {
    it('Invalid product details information should return an unprocessable input error during product update', done => {
      chai
        .request(app)
        .put('/api/v1/products/5')
        .send(invalidProductEntry)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    it('Non-existing product id should return NOT FOUND error during product update', done => {
      chai
        .request(app)
        .put('/api/v1/products/10')
        .send(validProductEntry)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Product not found');
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.status).to.equal(false);
          done(err);
        });
    });

    it('Product should update with same product details when there are no input errors', done => {
      chai
        .request(app)
        .put('/api/v1/products/5')
        .send(validProductEntry)
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
          expect(res.body.message).to.equal('Product not found');
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.status).to.equal(false);
          done(err);
        });
    });

    it('Admin should be able to delete a product after passing a product id that exist', done => {
      chai
        .request(app)
        .del('/api/v1/products/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Product deleted');
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.status).to.equal(true);
          done(err);
        });
    });
  });
});
