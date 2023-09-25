import process from 'process';

const DB_TYPE = process.env.DB_TYPE;
const PG_HOST = process.env.PG_HOST;
const PG_PORT = +process.env.PG_PORT;
const PG_USERNAME = process.env.PG_USERNAME;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_DB = process.env.PG_DB;

export { DB_TYPE, PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DB };
