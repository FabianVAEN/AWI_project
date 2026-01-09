const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'TU_PASSWORD',
  database: 'awi_db',
  port: 5432,
});

module.exports = pool;
