import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import './controllers';
import './utils';

const { expect } = chai;
chai.use(chaiHttp);

describe('Store Manager', () => {
  it('It should catch and respond to undefined routes', done => {
    chai
      .request(app)
      .get('/*')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done(err);
      });
  });
});
