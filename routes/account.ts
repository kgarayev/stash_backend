// IMPORTING STUFF:
// import express
import express from "express";

import dotenv from "dotenv";
dotenv.config();

// import router
const router = express.Router();

// importing the random id generator function
import { genRandomString } from "../utils/math";

// importing joi validator
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

  let chosenItems = [0, 1, 2];

  const results = await asyncPgSQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = results[0].user_id;

  try {
    // ask sql for data
    // returns an array of results

    const results = (await asyncPgSQL(
      `SELECT * FROM accounts JOIN users ON accounts.user_id = users.id WHERE users.id = $1`,
      [userId]
    )) as DatabaseEntry[];

    delete results[0].id;
    delete results[0].user_id;
    delete results[0].created;

    console.log(results[0]);

    // check if the results are there
    if (results.length > 0) {
      res.send({ status: 1, result: results[0] });
      return;
    }
  } catch (e) {
    console.log(e);
    // if the resuts are not there, communicate this
    res.send({ status: 0, e });
    return;
  }

  // if the resuts are not there, communicate this
  res.send({ status: 0, reason: "Id not found" });
  return;
});

// exporting the router
export { router };
