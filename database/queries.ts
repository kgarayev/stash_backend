// a file with all sql queries in it

const queries = {
  // create users table if does not exist
  createUsersTable: () => {
    return `CREATE TABLE IF NOT EXISTS users (
          id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
          first_name VARCHAR(64) NOT NULL,
          last_name VARCHAR(64) NOT NULL,
          number VARCHAR(20) NOT NULL UNIQUE,
          email VARCHAR(64) NOT NULL UNIQUE,
          dob DATE NOT NULL,
          password_hash VARCHAR(64) NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
  },

  //   create accounts table if does not exist
  createAccountsTable: () => {
    return `CREATE TABLE IF NOT EXISTS accounts (
          id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
          account_name VARCHAR(64) NOT NULL,
          account_number INT(8) NOT NULL UNIQUE,
          sort_code INT(6) NOT NULL UNIQUE,
          currency_code VARCHAR(3) NOT NULL,
          currency_name VARCHAR(64) NOT NULL,
          currency_symbol VARCHAR(2) NOT NULL,
          currency_country VARCHAR(64) NOT NULL,
          balance DECIMAL(10,2) NOT NULL,
          user_id INT(11) NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
  },

  //   create transactions table if does not exist
  createTransactionsTable: () => {
    return `CREATE TABLE IF NOT EXISTS transactions (
          id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
          type VARCHAR(64) NOT NULL,
          details VARCHAR(64) NOT NULL,
          created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          amount DECIMAL(10, 2) NOT NULL,
          account_id INT(11) NOT NULL
      )`;
  },

  //   create tokens table if does not exist
  createTokensTable: () => {
    return `CREATE TABLE IF NOT EXISTS tokens (
            id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
            user_id INT(11) NOT NULL,
            token VARCHAR(128) NOT NULL, 
            entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            max_age INT(11) NOT NULL
        )`;
  },

  // createSessionsTable: () => {
  //   return `CREATE TABLE IF NOT EXISTS sessions (
  //     id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
  //     user_id INT(11) NOT NULL,
  //     data VARCHAR(128) NOT NULL,
  //     entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //     expires INT(11) NOT NULL
  // )`;
  // },

  //   add user query
  addUser: () => {
    return `INSERT INTO users (first_name, last_name, number, email, dob, password_hash) 
              VALUES (
                  ?, 
                  ?, 
                  ?, 
                  ?, 
                  STR_TO_DATE(?, "%d/%m/%Y"), 
                  ?)`;
  },

  //   add account query
  addAccount: () => {
    return `INSERT INTO accounts (
                      account_name, account_number, 
                      sort_code, currency_code, 
                      currency_name, currency_symbol, 
                      currency_country, balance, user_id) 
                          VALUES (
                              ?, 
                              ?, 
                              ?, 
                              ?, 
                              ?,
                              ?,
                              ?,
                              ?,
                              ?)`;
  },

  //   add transaction query
  addTransaction: () => {
    return `INSERT INTO transactions (type, details, amount, account_id) 
              VALUES (
                ?, 
                ?, 
                ?, 
                ?)`;
  },

  // GENERIC QUERIES:
  //  a generic remove/delete query
  deleteQuery: () => {
    return `DELETE FROM ? WHERE id = ?`;
  },

  //   a generic update query
  updateQuery: () => {
    return `UPDATE ? SET ? = "?" WHERE id = ?`;
  },

  //   a generic get/select query
  getQuery: () => {
    return `SELECT * FROM ? WHERE id = ?`;
  },

  // returns a user form SQL if credentials match
  checkUserCreds: () => {
    return `SELECT id FROM users
            WHERE email = ?
            AND password_hash = ?`;
  },

  addToken: () => {
    return `INSERT INTO tokens
            (user_id, token, max_age)
            VALUES (?, ?, ?)`;
  },

  getIdByToken: () => {
    return `SELECT user_id FROM tokens
            WHERE token = ?`;
  },

  getAll: () => {
    return `SELECT * FROM ?`;
  },
};

export { queries };
