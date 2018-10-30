import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import mockData from '../mock';
import pool from '../../utils/connection';
import ProductHelper from '../../helpers/productHelper';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;

describe('Products', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.ownerLogin);
    ownerToken = response.body.token;

    /* Create a new product category */
    await chai
      .request(app)
      .post('/api/v1/category/')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(mockData.category.validCategoryName);
  });

  after(async () => {
    await pool.query('TRUNCATE TABLE users,category,products RESTART IDENTITY');
  });

  describe('Get All Products', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).get('/api/v1/products');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('It should return a message when there are no created products yet.', async () => {
      const productHelperStub = sinon
        .stub(ProductHelper, 'allProducts')
        .returns('No product created yet.');

      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.result).to.be.a('string');
      expect(response.body.result).to.equal('No product created yet.');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(true);
      productHelperStub.restore();
    });

    it('Authenticated users should be able to view all product', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.result).is.to.be.an('array');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(true);
    });
  });

  describe('Create Products', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).post('/api/v1/products');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Invalid product information should return an unprocessable entity error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.invalidProductInfo);

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('error');
    });

    it('Should not create a product when non-existing category id is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.NonExistingCategoryId);

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('The category does not exit');
    });

    it('Admin should be able to create a product', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.validProductInfo);

      expect(response.status).to.equal(201);
    });

    it('Admin should not be able to create a new product with the same name', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.validProductInfo);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('The provided product name already exists.');
    });
  });

  describe('Get Single Product', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).get('/api/v1/products/1');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/1')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Invalid product id should return an unprocessable input error', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/*')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('error');
      expect(response.body.error).is.to.be.an('array');
    });

    it('Non-existing product id should return a not found error when fetching product', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.equal(false);
      expect(response.body.status).to.be.a('boolean');
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.equal('Product not found');
    });

    it('Valid product id should return the matching product', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.result).is.to.be.an('object');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(true);
      expect(response.body.result).to.have.keys([
        'id',
        'imageurl',
        'name',
        'categoryid',
        'price',
        'qty',
        'categoryname'
      ]);
    });
  });

  /* describe('PUT /products/:id', () => {
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
  }); */
});
