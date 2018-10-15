import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Store Manager', () => {
  describe('Products', () => {
    it('Users should be able to get all product', done => {
      chai
        .request(app)
        .get('/api/v1/products/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done(err);
        });
    });

    it('It should return an Unprocessable Input error when user pass in an invalid product id', done => {
      chai
        .request(app)
        .get('/api/v1/products/*')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    it('It should return a Not Found response when user pass in an invalid product id', done => {
      chai
        .request(app)
        .get('/api/v1/products/5')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.not.have.property('result');
          done(err);
        });
    });

    it('Users should be able to view a single product', done => {
      chai
        .request(app)
        .get('/api/v1/products/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('result');
          expect(res.body.result).to.have.length(1);
          done(err);
        });
    });
  });
});
