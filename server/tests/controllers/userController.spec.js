import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../..';
import mockData from '../mock';
import pool from '../../utils/connection';
import UserHelper from '../../helpers/userHelper';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let attendantToken;

describe('User', () => {
  after(async () => {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY');
  });

  describe('Login User', () => {
    it('Invalid User ID should return an error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.invalidLogin);

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('error');
    });

    it('Non-existing account should return 404 error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.nonExistingLogin);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('User not found');
    });

    it('Invalid credentials should return 401 error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.failedLogin);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('Authenication Failed');
    });

    it('Store Attendant or Admin should be able to login ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.ownerLogin);

      expect(response.status).to.equal(200);
      expect(response.body.token).to.be.a('string');
      ownerToken = response.body.token;
    });
  });

  describe('Signup User', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(mockData.signUp.invalidNewUser);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer WrongToken`)
        .send(mockData.signUp.invalidNewUser);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Unsupported new user details should return an error when creating a user', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.invalidNewUser);

      expect(response.status).to.equal(422);
      expect(response.body).to.have.property('error');
    });

    it('Only a store admin/owner should be able to create an account', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.validNewUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('result');
      expect(response.body).to.be.an('object');
      expect(response.body.result).to.have.keys(['userid', 'name', 'password', 'role']);
    });

    it('It should return forbidden when an attendant wants to create an account', async () => {
      const loginResponse = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.attendantLogin);

      attendantToken = loginResponse.body.token;

      const signupResponse = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send(mockData.signUp.validNewUser);
      expect(signupResponse.status).to.equal(403);
      expect(signupResponse.body.message).to.equal('You cant perform this action. Admins Only');
    });

    it('It should handle error from database when a creating user', async () => {
      const userHelperStub = sinon.stub(UserHelper, 'createUser').returns(new Error());
      const resonse = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.validNewUser);
      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });
});
