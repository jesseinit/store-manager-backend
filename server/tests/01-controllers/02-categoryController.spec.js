import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import mockData from '../mock';
import pool from '../../utils/connection';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let attendantToken;

describe('Category', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.ownerLogin);
    ownerToken = response.body.data.token;
  });

  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.attendantLogin);
    attendantToken = response.body.data.token;
  });

  after(async () => {
    await pool.query('TRUNCATE TABLE category RESTART IDENTITY');
  });

  describe('Create Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).post('/api/v1/category/');

      expect(response.status).to.equal(401);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
    });

    it('Should return a validation error when an invalid product name is provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.invalidCategoryName);

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('error');
    });

    it('Attendants should not be able to create a new product category', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send(mockData.category.validCategoryName);

      expect(response.status).to.equal(403);
    });

    it('Admin should be able to create a new product category', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.have.keys(['category_id', 'category_name']);
    });

    it('Admin should not be able to create a new product category with the same name', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(response.status).to.equal(400);
    });
  });

  describe('Get All Categories', () => {
    it('Admin should be able to see all categories', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });

  describe('Get Single Category', () => {
    it('Admin should be able to retrieve a single category', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('It should return a not found error when retrieving a category that does not exist', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/category/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });
  });

  describe('Modify Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).put('/api/v1/category/1');

      expect(response.status).to.equal(401);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer WrongToken`)
        .send(mockData.category.validUpdateName);

      expect(response.status).to.equal(401);
    });

    it('Admin should not be able to update a category with non-existing id', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/10')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validUpdateName);

      expect(response.status).to.equal(404);
    });

    it('Admin should not be able to update a category with an existing category name', async () => {
      await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Fittings' });

      const response = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Fittings' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('The category name already exists.');
    });

    it('Admin should be able to update a category', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validUpdateName);

      expect(response.status).to.equal(200);
    });
  });

  describe('Delete Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).del('/api/v1/category/1');

      expect(response.status).to.equal(401);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/1')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
    });

    it('It should not be able to delete a non-existing category', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });

    it('Admin should be able to delete a category', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });
});
