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
          created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
          created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
  },

  //   create transactions table if does not exist
  createTransactionsTable: () => {
    return `CREATE TABLE IF NOT EXISTS transactions (
          id INT(11) PRIMARY KEY AUTO_INCREMENT UNIQUE,
          type VARCHAR(64) NOT NULL,
          details VARCHAR(64) NOT NULL,
          created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
            entry_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`;
  },

  //   add user query
  addUser: (
    firstName: string,
    lastName: string,
    number: string,
    email: string,
    dob: string,
    password_hash: string
  ) => {
    return `INSERT INTO users (first_name, last_name, number, email, dob, password) 
              VALUES (
                  "${firstName}", 
                  "${lastName}", 
                  "${number}", 
                  "${email}", 
                  STR_TO_DATE("${dob}", "%d/%m/%Y"), 
                  "${password_hash}")`;
  },

  //   add account query
  addAccount: (
    accountName: string,
    accountNumber: string,
    sortCode: string,
    currencyCode: string,
    currencyName: string,
    currencySymbol: string,
    currencyCountry: string,
    balance: string,
    userId: string
  ) => {
    return `INSERT INTO accounts (
                      account_name, account_number, 
                      sort_code, currency_code, 
                      currency_name, currency_symbol, 
                      currency_country, balance, user_id) 
                          VALUES (
                              "${accountName}", 
                              "${accountNumber}", 
                              "${sortCode}", 
                              "${currencyCode}", 
                              "${currencyName}",
                              "${currencySymbol}",
                              "${currencyCountry}",
                              "${balance}",
                              "${userId}")`;
  },

  //   add transaction query
  addTransaction: (
    type: string,
    details: string,
    amount: string,
    accountId: string
  ) => {
    return `INSERT INTO transactions (type, details, amount, account_id) 
              VALUES (
                  "${type}", 
                  "${details}", 
                  "${amount}", 
                  "${accountId}")`;
  },

  // GENERIC QUERIES:
  //  a generic remove/delete query
  deleteQuery: (dbName: string, id: number) => {
    return `DELETE FROM ${dbName} WHERE id LIKE ${id}`;
  },

  //   a generic update query
  updateQuery: (
    dbName: string,
    dbColumn: string,
    newValue: string,
    id: number
  ) => {
    return `UPDATE ${dbName} SET ${dbColumn} = "${newValue}" WHERE id LIKE "${id}"`;
  },

  //   a generic get/select query
  getQuery: (dbName: string, id: number) => {
    return `SELECT * FROM ${dbName} WHERE id LIKE ${id}`;
  },

  // returns a user form SQL if credentials match
  checkUserCreds: (email: string, hashedPassword: string) => {
    return `SELECT id FROM users
            WHERE email LIKE ${email}
            AND password LIKE ${hashedPassword}`;
  },

  addToken: (userId: number | string, token: string) => {
    return `INSERT INTO tokens
            (user_id, token)
            VALUES ("${userId}", "${token}")`;
  },
};

export { queries };
