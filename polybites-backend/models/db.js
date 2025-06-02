const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  statement_timeout: 0,         // No statement timeout
  query_timeout: 0,             // No query timeout
  allowExitOnIdle: true,        // Optional - exit cleanly
  idle_in_transaction_session_timeout: 0, // Optional
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};