import bcrypt from 'bcrypt';
import pool from '../utils/connection';
import query from '../utils/queries';

const usersTable = `CREATE TABLE IF NOT EXISTS users (
  id serial NOT NULL PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password varchar(200) NOT NULL,
  role varchar(20) NOT NULL
);`;

const categoryTable = `CREATE TABLE IF NOT EXISTS category (
  category_id serial NOT NULL PRIMARY KEY,
  category_name varchar(30) UNIQUE NOT NULL
);`;

const productsTable = `CREATE TABLE IF NOT EXISTS products (
  product_id serial NOT NULL PRIMARY KEY,
  product_image text NOT NULL,
  product_name text UNIQUE NOT NULL,
  product_price float NOT NULL,
  product_qty int NOT NULL,
  category_id int NOT NULL
);`;

const salesTable = `CREATE TABLE IF NOT EXISTS sales (
  sale_id serial NOT NULL PRIMARY KEY,
  user_id int NOT NULL,
  sale_date TIMESTAMPTZ DEFAULT CURRENT_DATE NOT NULL,
  sale_total float NOT NULL
);`;

const productSales = `CREATE TABLE IF NOT EXISTS productsales (
  id serial NOT NULL PRIMARY KEY,
  product_id int NOT NULL,
  product_name text NOT NULL,
  product_price float NOT NULL,
  sale_id int NOT NULL,
  product_worth float NOT NULL,
  product_qty int NOT NULL,
  sale_date TIMESTAMPTZ DEFAULT CURRENT_DATE NOT NULL
);`;

(async () => {
  console.time('Seeding Completed in');
  const ownerPassword = 'owner';
  const hashedPassword = await bcrypt.hash(ownerPassword, 10);
  await pool.query(`${usersTable}`);
  await pool.query(`Select * from users where role = $1`, ['Owner']).then(result => {
    if (result.rowCount < 1) {
      pool.query(query.regUser('Store Owner', 'owner@storemanager.com', hashedPassword, 'Owner'));
    }
  });
  await pool.query(`${categoryTable}`);
  await pool.query(`${productsTable}`);
  await pool.query(`${salesTable}`);
  await pool.query(`${productSales}`);
  console.timeEnd('Seeding Completed in');
})();
