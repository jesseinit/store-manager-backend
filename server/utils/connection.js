import 'babel-polyfill';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV;
/* istanbul ignore next */
const connectionURI = environment === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString: connectionURI });

export default pool;
