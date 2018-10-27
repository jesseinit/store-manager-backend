import 'babel-polyfill';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import query from '../utils/queries';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const usersTable = `CREATE TABLE IF NOT EXISTS users (
  userId SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(200) NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL
);`;

const productsTable = `CREATE TABLE IF NOT EXISTS products (
  productId  SERIAL PRIMARY KEY NOT NULL,
  productName varchar(200) UNIQUE NOT NULL,
  categoryId int NOT NULL,
  categoryName varchar(50) NOT NULL,
  productPrice float NOT NULL,
  productQty int NOT NULL
);`;

const categoryTable = `CREATE TABLE IF NOT EXISTS category (
  categoryID SERIAL PRIMARY KEY NOT NULL,
  categoryName varchar(200) UNIQUE NOT NULL
);`;

const salesTable = `CREATE TABLE IF NOT EXISTS sales (
  id SERIAL NOT NULL,
  saleId SERIAL PRIMARY KEY NOT NULL,
  saleDate DATE DEFAULT CURRENT_DATE NOT NULL,
  productID int NOT NULL,
  productQty int NOT NULL,
  saleTotal float NOT NULL,
  userID int NOT NULL
);`;

(async () => {
  console.time('Seding Completed in');
  const ownerPassword = 'owner';
  const hashedPassword = await bcrypt.hash(ownerPassword, 10);
  await pool.query(`${usersTable}`);
  await pool.query(`Select * from users where role = $1`, ['Owner']).then(result => {
    if (result.rowCount < 1) {
      pool.query(query.regUser('Store Owner', hashedPassword, 'Owner'));
    }
  });
  await pool.query(`${productsTable}`);
  await pool.query(`${categoryTable}`);
  await pool.query(`${salesTable}`);
  console.timeEnd('Seding Completed in');
})();