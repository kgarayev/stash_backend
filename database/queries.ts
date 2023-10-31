// a file with all sql queries in it

const queries = {
  // create users table if does not exist
  createUsersTable: () => {
    return `CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(64) NOT NULL,
          last_name VARCHAR(64) NOT NULL,
          number VARCHAR(20) NOT NULL UNIQUE,
          email VARCHAR(64) NOT NULL UNIQUE,
          dob DATE NOT NULL,
          password_hash VARCHAR(64) NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
  },

  // create accounts table if does not exist
  createAccountsTable: () => {
    return `CREATE TABLE IF NOT EXISTS accounts (
          id SERIAL PRIMARY KEY,
          account_name VARCHAR(64) NOT NULL,
          account_number INTEGER NOT NULL UNIQUE,
          sort_code INTEGER NOT NULL UNIQUE,
          currency_code VARCHAR(3) NOT NULL,
          currency_name VARCHAR(64) NOT NULL,
          currency_symbol VARCHAR(2) NOT NULL,
          currency_country VARCHAR(64) NOT NULL,
          balance DECIMAL(10,2) NOT NULL,
          user_id INTEGER NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
  },

  // create transactions table if does not exist
  createTransactionsTable: () => {
    return `CREATE TABLE IF NOT EXISTS transactions (
          id SERIAL PRIMARY KEY,
          type VARCHAR(64) NOT NULL,
          details VARCHAR(64) NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          amount DECIMAL(10, 2) NOT NULL,
          account_id INTEGER NOT NULL
      )`;
  },

  // create tokens table if does not exist
  createTokensTable: () => {
    return `CREATE TABLE IF NOT EXISTS tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            token VARCHAR(128) NOT NULL, 
            entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            max_age INTEGER NOT NULL
        )`;
  },

  // add user query
  addUser: () => {
    return `INSERT INTO users (first_name, last_name, number, email, dob, password_hash) 
              VALUES (
                  $1, 
                  $2, 
                  $3, 
                  $4, 
                  TO_DATE($5, 'DD/MM/YYYY'), 
                  $6)`;
  },

  // add account query
  addAccount: () => {
    return `INSERT INTO accounts (
                    account_name, account_number, 
                    sort_code, currency_code, 
                    currency_name, currency_symbol, 
                    currency_country, balance, user_id) 
                        VALUES (
                            $1, 
                            $2, 
                            $3, 
                            $4, 
                            $5,
                            $6,
                            $7,
                            $8,
                            $9)`;
  },

  // add transaction query
  addTransaction: () => {
    return `INSERT INTO transactions (type, details, amount, account_id) 
            VALUES (
              $1, 
              $2, 
              $3, 
              $4)`;
  },

  // GENERIC QUERIES:
  // a generic remove/delete query
  deleteQuery: () => {
    // Note: Table names or column names as parameters will not work
    return `DELETE FROM your_table_name WHERE id = $1`; // Adjust 'your_table_name' dynamically as required
  },

  // a generic update query
  updateQuery: () => {
    // Note: Same note as deleteQuery about table names and column names
    return `UPDATE your_table_name SET your_column = $1 WHERE id = $2`; // Adjust 'your_table_name' and 'your_column' dynamically
  },

  // a generic get/select query
  getQuery: () => {
    // Note: Same note as deleteQuery about table names
    return `SELECT * FROM your_table_name WHERE id = $1`; // Adjust 'your_table_name' dynamically
  },

  // returns a user from SQL if credentials match
  checkUserCreds: () => {
    return `SELECT id FROM users
          WHERE email = $1
          AND password_hash = $2`;
  },

  addToken: () => {
    return `INSERT INTO tokens
          (user_id, token, max_age)
          VALUES ($1, $2, $3)`;
  },

  getIdByToken: () => {
    return `SELECT user_id FROM tokens
          WHERE token = $1`;
  },

  getAll: () => {
    // Note: This will not work with a parameterized table name.
    return `SELECT * FROM your_table_name`; // Adjust 'your_table_name' dynamically
  },
};
export { queries };
