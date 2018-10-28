import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Sales', () => {
  describe('GET /sales', () => {
    it('Admin should be able to retrieve all sales made in the store', done => {
      chai
        .request(app)
        .get('/api/v1/sales/')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.result).to.be.an('array');
          expect(res.body.result[0]).to.have.keys([
            'id',
            'date',
            'productName',
            'price',
            'qty',
            'total'
          ]);
          done(err);
        });
    });
  });

  describe('GET /sales/:id', () => {
    it('Invalid sales id should return an unprocessable input error', done => {
      chai
        .request(app)
        .get('/api/v1/sales/*')
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('error');
          expect(res.body.error[0]).to.equal('Sales Order ID must be a positve integer from 1');
          done(err);
        });
    });

    it('Non-existing sales id should return a not found error when fetching a sale', done => {
      chai
        .request(app)
        .get('/api/v1/sales/5')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('Sale Record not found');
          done(err);
        });
    });

    it('Existing sale id should return the matching sale record', done => {
      chai
        .request(app)
        .get('/api/v1/sales/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal(true);
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.result).to.be.an('object');
          expect(res.body.result).to.have.keys(['id', 'date', 'productName', 'price', 'qty', 'total']);
          done(err);
        });
    });
  });

  describe('POST /sales', () => {
    it('Invalid product id should return an unprocessable input error', done => {
      chai
        .request(app)
        .post('/api/v1/sales')
        .send({ id: 0, qty: 0 })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          expect(res.body).to.have.property('error');
          done(err);
        });
    });

    it('Attendant should not be able to process orders on unavalable products or enough stock', done => {
      chai
        .request(app)
        .post('/api/v1/sales')
        .send({ id: 10, qty: 14 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal(false);
          expect(res.body.message).to.equal('Product or stock not available');
          done(err);
        });
    });

    it('Attendant should be able to create a sales record on a product that is instock', done => {
      chai
        .request(app)
        .post('/api/v1/sales')
        .send({ id: 2, qty: 2 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal(true);
          expect(res.body.status).to.be.a('boolean');
          expect(res.body.result).to.be.an('object');
          expect(res.body.result).to.have.keys(['id', 'date', 'productName', 'price', 'qty', 'total']);
          done(err);
        });
    });
  });
});
