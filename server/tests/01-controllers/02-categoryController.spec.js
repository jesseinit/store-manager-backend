import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../..';
import mockData from '../mock';
import CategoryHelper from '../../helpers/categoryHelper';
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
    ownerToken = response.body.token;
  });

  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.attendantLogin);
    attendantToken = response.body.token;
  });

  after(async () => {
    await pool.query('TRUNCATE TABLE category RESTART IDENTITY');
  });

  describe('Create Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).post('/api/v1/category/');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
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
      expect(response.body.message).to.equal('You cant perform this action. Admins Only');
    });

    it('Admin should be able to create a new product category', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('result');
      expect(response.body.result).to.have.keys(['categoryid', 'categoryname']);
    });

    it('Admin should not be able to create a new product category with the same name', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('A category with that name exists.');
    });

    it('It should handle error from database failure when creating a category', async () => {
      const userHelperStub = sinon.stub(CategoryHelper, 'createCategory').returns(new Error());
      const resonse = await chai
        .request(app)
        .post('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Modify Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).put('/api/v1/category/1');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer WrongToken`)
        .send(mockData.category.validUpdateName);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Admin should not be able to update a category with non-existing id', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/10')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validUpdateName);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('The category not found.');
    });

    it('Admin should not be able to update a category with an existing category name', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.existingCategoryName);

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
      expect(response.body).to.have.property('result');
      expect(response.body.result).to.have.keys(['categoryid', 'categoryname']);
    });

    it('It should handle error from database failure when updating a category', async () => {
      const userHelperStub = sinon.stub(CategoryHelper, 'updateCategory').returns(new Error());
      const resonse = await chai
        .request(app)
        .put('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Get All Categories', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).get('/api/v1/category/');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/category/')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Admin should get a message when there are no created categories', async () => {
      const userHelperStub = sinon
        .stub(CategoryHelper, 'getAllCategories')
        .returns('You have no product category yet.');

      const response = await chai
        .request(app)
        .get('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
      userHelperStub.restore();
    });

    it('Admin should be able to see all categories', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
    });

    it('It should handle error from database failure when getting all categories', async () => {
      const userHelperStub = sinon.stub(CategoryHelper, 'getAllCategories').returns(new Error());
      const resonse = await chai
        .request(app)
        .get('/api/v1/category/')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.category.validCategoryName);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Delete Category', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).del('/api/v1/category/1');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/1')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('It should not be able to delete a non-existing category', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Category not found');
    });

    it('Admin should be able to delete a category', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/category/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
      expect(response.body.result).to.equal(true);
    });
  });
});
