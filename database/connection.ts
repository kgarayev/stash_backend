// import pg
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// import queries functions
import { queries } from "./queries";

const {
  createUsersTable,
  createAccountsTable,
  createTransactionsTable,
  createTokensTable,
} = queries;

const { Pool } = pg;

// instance of a connection
// this driver does not support promises
// need to create our own wrapper / promisify this
// connect to RDMS without specifying the database itself
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
});

// wrapping the query code in the promise to make it async await compatible
// resolve if no error, reject if error
// wrapping the drive inside a promise
// returns an array
const asyncPgSQL = (
  query: string,
  params: any[]
): Promise<pg.QueryResult<any>> => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
      return;
    });
  });
};

(async () => {
  try {
    await asyncPgSQL(queries.createUsersTable(), []);
    await asyncPgSQL(queries.createAccountsTable(), []);
    await asyncPgSQL(queries.createTransactionsTable(), []);
    await asyncPgSQL(queries.createTokensTable(), []);
  } catch (error) {
    console.log(error);
  }
})();

// exporting the function to be used elsewhere on the project
export { asyncPgSQL };
