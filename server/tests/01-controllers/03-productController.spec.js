import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import mockData from '../mock';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let attendantToken;

describe('Products', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.ownerLogin);
    ownerToken = response.body.data.token;

    const attendantResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.attendantLogin);
    attendantToken = attendantResponse.body.data.token;

    await chai
      .request(app)
      .post('/api/v1/category/')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(mockData.category.validCategoryName);
  });

  describe('Get All Products', () => {
    it('It should return a message when there are no created products yet.', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Authenticated users should be able to view all product', async () => {
      await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          imgUrl: 'http://example.com/photo.jpg',
          name: 'Router 2',
          categoryid: 1,
          price: 10.01,
          qty: 10
        });

      await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          imgUrl: 'http://example.com/photo.jpg',
          name: 'Router 3',
          categoryid: 1,
          price: 10.01,
          qty: 10
        });

      const response = await chai
        .request(app)
        .get('/api/v1/products?limit=1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Authenticated users can search for a particular product by name', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products?search=r')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Authenticated users can search for a particular product by category', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products?search=r&catid=1&page=2')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Authenticated users can search for a particular product by remaining stock', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products?stock=11')
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(response.status).to.equal(200);
    });
  });

  describe('Create Products', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).post('/api/v1/products');

      expect(response.status).to.equal(401);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
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
    });
  });

  describe('Get Single Product', () => {
    it('Invalid product id should return an unprocessable input error', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/*')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(422);
    });

    it('Non-existing product id should return a not found error when fetching product', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });

    it('Valid product id should return the matching product', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });

  describe('Update Product', () => {
    it('Attendant should not be able to update a product', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/products/1')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send(mockData.products.validProductInfo);

      expect(response.status).to.equal(403);
    });

    it('Admin should not be able to update a product with a product name that exists', async () => {
      await chai
        .request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ imgUrl: 'http://example.com/photo.jpg', name: 'TV', categoryid: 1, price: 10.01, qty: 10 });

      const response = await chai
        .request(app)
        .put('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ imgUrl: 'http://example.com/photo.jpg', name: 'TV', categoryid: 1, price: 10.01, qty: 10 });

      expect(response.status).to.equal(400);
    });

    it('Admin should not be able to update a product with a category id does not exist', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.NonExistingCategoryIdProductUpdateInfo);

      expect(response.status).to.equal(400);
    });

    it('Admin should be able to update a product', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.products.validProductUpdateInfo);

      expect(response.status).to.equal(200);
    });
  });

  describe('Delete Product', () => {
    it('Attendants should not be able to delete a product', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/products/1')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(403);
    });

    it('It should return not found when trying to delete non-existing products', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/products/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });

    it('Admins only should be able to delete a product', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/products/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });
});
