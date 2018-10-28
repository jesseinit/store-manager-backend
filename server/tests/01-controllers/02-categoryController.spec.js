import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../..';
import mockData from '../mock';
import pool from '../../utils/connection';
import CategoryHelper from '../../helpers/categoryHelper';

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
    await pool.query('TRUNCATE TABLE users,category RESTART IDENTITY');
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
});
