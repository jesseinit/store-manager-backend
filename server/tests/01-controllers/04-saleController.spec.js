import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import mockData from '../mock';
import pool from '../../utils/connection';

const { expect } = chai;
chai.use(chaiHttp);

let ownerToken;
let attendantToken;

describe('Sales', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.ownerLogin);

    ownerToken = response.body.token;

    console.log('Owner Token: ', ownerToken);

    const attendantResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.attendantLogin);
    attendantToken = attendantResponse.body.token;

    console.log('Attendant Token: ', attendantToken);

    const newProduct = await chai
      .request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(mockData.products.validProductInfoForSale);
    console.log('New Product ', newProduct.body);
  });

  after(async () => {
    await pool.query('TRUNCATE TABLE users,category,products,sales,productSales RESTART IDENTITY');
  });

  describe('Create Sale', () => {
    it('Admin should not be able to create a sale record', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ products: [{ id: 3, qty: 1 }] });

      expect(response.status).to.equal(403);
    });

    it('Attendants only should be able to create a sale record', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1 }] });

      expect(response.status).to.equal(201);
    });

    it('It should return not found error on a product that is non-exisiting', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 10, qty: 1 }] });
      expect(response.status).to.equal(400);
    });

    it('It should return non found on a product that is non-exisiting', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1000 }] });
      expect(response.status).to.equal(400);
    });
  });
});
