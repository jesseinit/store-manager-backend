import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Store Manager', () => {
  it('User should be able to get all product', done => {
    chai
      .request(app)
      .get('/api/v1/products/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done(err);
      });
  });
});
