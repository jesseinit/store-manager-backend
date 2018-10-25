import 'babel-polyfill';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import query from './queries';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const usersTable = `CREATE TABLE IF NOT EXISTS Users (
  UserID SERIAL PRIMARY KEY NOT NULL,
  Name VARCHAR(200) NOT NULL,
  Password VARCHAR(200) NOT NULL,
  Role VARCHAR(20) NOT NULL
);`;

const productsTable = `CREATE TABLE IF NOT EXISTS Products (
  ProductID  SERIAL PRIMARY KEY NOT NULL,
  ProductName varchar(200) UNIQUE NOT NULL,
  CategoryID int NOT NULL,
  CategoryName varchar(50) NOT NULL,
  ProductPrice float NOT NULL,
  ProductQty int NOT NULL
);`;

const categoryTable = `CREATE TABLE IF NOT EXISTS Category (
  CategoryID SERIAL PRIMARY KEY NOT NULL,
  CategoryName varchar(200) UNIQUE NOT NULL
);`;

const salesTable = `CREATE TABLE IF NOT EXISTS Sales (
  id SERIAL NOT NULL,
  SaleID SERIAL PRIMARY KEY NOT NULL,
  SaleDate DATE DEFAULT CURRENT_DATE NOT NULL,
  ProductID int NOT NULL,
  ProductQty int NOT NULL,
  SaleTotal float NOT NULL,
  UserID int NOT NULL
);`;

const setupDbTables = async () => {
  await pool.query(`${usersTable} ${productsTable} ${categoryTable} ${salesTable}`);
  const owner = await pool.query(query.findOwner());
  if (owner.rows.length === 0) {
    const ownerPassword = 'owner';
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);
    await pool.query(query.regUser('Store Owner', hashedPassword, 'Owner'));
  }
};
export { pool, setupDbTables };
