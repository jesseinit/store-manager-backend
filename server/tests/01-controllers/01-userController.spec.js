import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../..';
import mockData from '../mock';
import UserHelper from '../../helpers/userHelper';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let attendantToken;
let adminToken;

describe('Store Manager', () => {
  it('It should be able to catch all undefined routes', async () => {
    const response = await chai.request(app).get('/undefined');
    expect(response.status).to.equal(404);
  });
});

describe('User', () => {
  describe('Login User', () => {
    it('Invalid user email should return an error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.invalidLogin);

      expect(response.status).to.equal(422);
    });

    it('Non-existing account should return 404 error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.nonExistingLogin);

      expect(response.status).to.equal(404);
    });

    it('Wrong credentials should return 401 error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.failedLogin);
      expect(response.status).to.equal(401);
    });

    it('Store Attendant or Admin should be able to login ', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.ownerLogin);

      expect(response.status).to.equal(200);
      expect(response.body.data.token).to.be.a('string');
      ownerToken = response.body.data.token;
    });
  });

  describe('Signup User', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).post('/api/v1/auth/signup');

      expect(response.status).to.equal(401);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer WrongToken`);

      expect(response.status).to.equal(401);
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
        .send(mockData.signUp.validNewAttendant);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('data');
      expect(response.body).to.be.an('object');
      expect(response.body.data).to.have.keys(['id', 'name', 'email', 'password', 'role']);
    });

    it('It should return forbidden when an attendant wants to create an account', async () => {
      const loginResponse = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.attendantLogin);

      attendantToken = loginResponse.body.data.token;

      const signupResponse = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send(mockData.signUp.validNewAdmin);

      expect(signupResponse.status).to.equal(403);
    });

    it('It should return a conflict error when account already exists', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.validNewAttendant);

      expect(response.status).to.equal(409);
    });

    it('It should handle error from database when a creating user', async () => {
      const userHelperStub = sinon.stub(UserHelper, 'createUser').returns(new Error());
      const resonse = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.validNewAttendant);
      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Get All User', () => {
    it('Attendants should not be able to retrieve all users', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(403);
    });

    it('Store admin/owner should be able to retrieve all users', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });

  describe('Update User', () => {
    it('It should return a not found error when trying to update a non-existing account', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/10')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(404);
    });

    it('Only a store owner/admin should be able to update an account', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/2')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(200);
    });

    it('Store admin should not be able to update Store owner account', async () => {
      await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.signUp.validNewAdmin);

      const loginResponse = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send(mockData.login.adminLogin);

      adminToken = loginResponse.body.data.token;

      const response = await chai
        .request(app)
        .put('/api/v1/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(403);
    });
  });

  describe('Delete User', () => {
    it('Store admin should not be able to delete store owner account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(403);
    });

    it('It should return a not found error when trying to delete a non-existing account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });

    it('Store owner should not be able to delete his/her account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/1')
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(response.status).to.equal(403);
    });

    it('Store owner should be able to delete other accounts', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/3')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });
  });
});
