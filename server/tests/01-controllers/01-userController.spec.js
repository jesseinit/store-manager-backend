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

describe('User', () => {
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

  describe('Get All User', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).get('/api/v1/users/');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Attendants should not be able to retrieve all users', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('You cant perform this action. Admins Only');
    });

    it('Store admin/owner should be able to retrieve all users', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
      expect(response.body.result).to.be.an('array');
      expect(response.body.result[0]).to.have.keys(['userid', 'name', 'password', 'role']);
    });

    it('It should handle error from database when retrieving all users', async () => {
      const userHelperStub = sinon.stub(UserHelper, 'getAllUsers').returns(new Error());
      const resonse = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Update User', () => {
    it('Should return an authentication error when authorization headers are not present', async () => {
      const response = await chai.request(app).put('/api/v1/users/2');

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('Should return an authentication error when an invalid token is passed', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/2')
        .set('Authorization', `Bearer WrongToken`)
        .send(mockData.signUp.invalidNewUser);

      expect(response.status).to.equal(401);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
    });

    it('It should return a not found error when trying to update a non-existing account', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/10')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('User not found');
    });

    it('Only a store owner/admin should be able to update an account', async () => {
      const response = await chai
        .request(app)
        .put('/api/v1/users/2')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
      expect(response.body).to.be.an('object');
      expect(response.body.result).to.have.keys(['userid', 'name', 'password', 'role']);
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

      adminToken = loginResponse.body.token;

      const response = await chai
        .request(app)
        .put('/api/v1/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('Admin cant update owner account');
    });

    it('It should handle error from database failure when modifying a user', async () => {
      const userHelperStub = sinon.stub(UserHelper, 'updateUser').returns(new Error());
      const resonse = await chai
        .request(app)
        .put('/api/v1/users/2')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(mockData.modifyUser.validUpdateInfo);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });

  describe('Delete User', () => {
    it('Store owner should not be able to delete his/her account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('You cant perform this action. Owner account Only');
    });

    it('It should return a not found error when trying to delete a non-existing account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('User not found');
    });

    it('Store owner should not be able to delete his/her account', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(403);
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(false);
      expect(response.body.message).to.equal('Store owner account cant be deleted');
    });

    it('Store owner should be able to delete other accounts', async () => {
      const response = await chai
        .request(app)
        .del('/api/v1/users/3')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('result');
      expect(response.body).to.have.property('status');
      expect(response.body.status).to.be.a('boolean');
      expect(response.body.status).to.equal(true);
      expect(response.body.result).to.equal(true);
    });

    it('It should handle error from database failure when deleting a user', async () => {
      const userHelperStub = sinon.stub(UserHelper, 'deleteUser').returns(new Error());
      const resonse = await chai
        .request(app)
        .del('/api/v1/users/2')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(resonse.status).to.equal(500);
      userHelperStub.restore();
    });
  });
});
