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

    ownerToken = response.body.data.token;

    const attendantResponse = await chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(mockData.login.attendantLogin);
    attendantToken = attendantResponse.body.data.token;

    await chai
      .request(app)
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(mockData.products.validProductInfoForSale);
  });

  after(async () => {
    await pool.query('TRUNCATE TABLE users,category,products,sales,productsales RESTART IDENTITY');
  });

  describe('Create Sale', () => {
    it('Store Admin/Owner should not be able to create a sale record', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ products: [{ id: 3, qty: 1 }] });

      expect(response.status).to.equal(403);
    });

    it('It should return an error when checking more than 10 items', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: Array(11).fill({ id: 3, qty: 1 }) });
      expect(response.status).to.equal(400);
    });

    it('It should return an error for duplicated product in cart', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1 }, { id: 3, qty: 1 }] });
      expect(response.status).to.equal(400);
    });

    it('Attendants only should be able to create a sale record', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1 }] });
      expect(response.status).to.equal(201);
    });

    it('It should return not found error on a product id that is non-exisiting', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 10, qty: 1 }] });
      expect(response.status).to.equal(404);
    });

    it('It should return bad request error for a product quantity that cant be fulfiled', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1000 }] });
      expect(response.status).to.equal(400);
    });
  });

  describe('Get All Sales', () => {
    it('Admin should be able to view all sale records', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Admin should be able to view dashboard misc information', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales?misc=true')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Admin should be able to view all sale records sorted by data range', async () => {
      const day = new Date().getDate();
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const today = `${year}-${month}-${day}`;
      const yesterday = `${year}-${month}-${day - 1}`;

      const response = await chai
        .request(app)
        .get(`/api/v1/sales?fdate=${yesterday}&tdate=${today}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Admin should be able to view all sale records sorted by attendant', async () => {
      const response = await chai
        .request(app)
        .get(`/api/v1/sales?userid=2`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Attendants should not be able to view all sale records', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(403);
    });

    it('Attendants should be able to view their misc information', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales/attendants?misc=true')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(200);
    });

    it('Attendants should be able to view their sales records', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales/attendants')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(200);
    });
  });

  describe('Get Single Sale', () => {
    before(() =>
      chai
        .request(app)
        .post('/api/v1/sales')
        .set('Authorization', `Bearer ${attendantToken}`)
        .send({ products: [{ id: 3, qty: 1 }] })
    );

    it('It should should return a not found error when fetching with a non-existing sale id', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales/10')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(404);
    });

    it('Admin should be able to view a sale record', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales/1')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).to.equal(200);
    });

    it('Attendants should be able to view a sale record', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/sales/2')
        .set('Authorization', `Bearer ${attendantToken}`);

      expect(response.status).to.equal(200);
    });

    it('Attendants should NOT be able to view a sale record made by another attendant', async () => {
      await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: 'Attendant 2',
          email: 'attendant.two@storemanager.com',
          password: 'inflames',
          role: 'Attendant'
        });

      const attendantResponse = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'attendant.two@storemanager.com', password: 'inflames' });

      const attendantToken2 = attendantResponse.body.data.token;

      const response = await chai
        .request(app)
        .get('/api/v1/sales/2')
        .set('Authorization', `Bearer ${attendantToken2}`);

      expect(response.status).to.equal(404);
    });
  });
});
