import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../..';
import mockData from '../mock';
import pool from '../../utils/connection';
import setupDb from '../../config/migrations';

setupDb();

const { expect } = chai;
chai.use(chaiHttp);

describe('User Login', () => {
  after(() => {
    pool.query('TRUNCATE TABLE users RESTART IDENTITY');
  });

  it('Invalid User ID should return an error', done => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.invalidLogin)
      .end((err, res) => {
        expect(res.status).to.equal(422);
        expect(res.body).to.have.property('error');
        done(err);
      });
  });

  it('Non-existing account should return 404 error', done => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.nonExistingLogin)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.a('boolean');
        expect(res.body.status).to.equal(false);
        expect(res.body.message).to.equal('User not found');
        done(err);
      });
  });

  it('Invalid credentials should return 401 error', done => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.failedLogin)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.a('boolean');
        expect(res.body.status).to.equal(false);
        expect(res.body.message).to.equal('Authenication Failed');
        done(err);
      });
  });

  it('Store Attendant or Admin should be able to login ', done => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.validLogin)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
        done(err);
      });
  });
});
