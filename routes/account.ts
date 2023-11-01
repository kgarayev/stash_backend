// IMPORTING STUFF:
// import express
import express from "express";

import dotenv from "dotenv";
dotenv.config();

// import router
const router = express.Router();

// importing the random id generator function
import { genRandomString } from "../utils/math";

// importing joi validation
import { validate } from "../validation/index";

// import asyncMySQL function
import { asyncPgSQL } from "../database/connection";

// import queries
import { queries } from "../database/queries";

const { addAccount, deleteQuery, updateQuery, getQuery, getIdByToken } =
  queries;

interface DatabaseEntry {
  id?: number;
  first_name?: string;
  last_name?: string;
  number?: string;
  email?: string;
  dob?: Date | string;
  password?: string;
  password_hash?: string;
  created?: Date | string;
  account_name?: string;
  account_number?: number;
  sort_code?: number;
  currency_code?: string;
  currency_name?: string;
  currency_symbol?: string;
  currency_country?: string;
  balance?: number;
  user_id?: number;
  type?: string;
  details?: string;
  date?: Date;
  amount?: number;
  account_id?: number;
}

// GET ROUTE:
// get a specific account router
router.get("/", async (req, res) => {
  const token = req.headers.token;

  try {
    // Assume that asyncPgSQL returns an object that includes a 'rows' array.
    // Make sure your asyncPgSQL function and queries align with this format.
    const tokenResult = await asyncPgSQL(getIdByToken(), [token]);

    // Check for the presence of rows and at least one row in the result
    if (!tokenResult.rows || tokenResult.rows.length === 0) {
      res.send({ status: 0, reason: "No results found" });
      return;
    }

    const userId = tokenResult.rows[0].user_id; // Assuming 'user_id' is returned in the rows.

    const accountResults = await asyncPgSQL(
      `SELECT * FROM accounts JOIN users ON accounts.user_id = users.id WHERE users.id = $1`,
      [userId]
    );

    // Check if there are any results
    if (!accountResults.rows || accountResults.rows.length === 0) {
      res.send({ status: 0, reason: "Id not found" });
      return;
    }

    // Assume that each row is a DatabaseEntry object
    const accounts = accountResults.rows as DatabaseEntry[];

    delete accounts[0].id;
    delete accounts[0].user_id;
    delete accounts[0].created;

    console.log(accounts[0]);

    res.send({ status: 1, result: accounts[0] });
  } catch (e) {
    console.log(e);
    res.send({ status: 0, e });
    return;
  }
});

// exporting the router
export { router };
