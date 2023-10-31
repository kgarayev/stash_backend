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
import { OkPacket } from "mysql";

const { addTransaction, deleteQuery, updateQuery, getQuery, getIdByToken } =
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

// // GET ROUTE:
// // get a specific transaction router
router.get("/", async (req, res) => {
  const token = req.headers.token;

  const results = await asyncPgSQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = results[0].user_id;

  // ask sql for data
  // returns an array of results
  try {
    const results = (await asyncPgSQL(
      `SELECT * FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = ?)`,
      [userId]
    )) as DatabaseEntry[];

    // check if the results are there
    if (results.length > 0) {
      res.send({ status: 1, results });
      return;
    }
  } catch (e) {
    // console.log(e);

    res.send({ status: 0, reason: e });
  }

  // if the resuts are not there, communicate this
  res.send({ status: 0, reason: "Id not found" });
});

// // POST ROUTE:
// // add transaction router
router.post("/receive", async (req, res) => {
  // just console log the body
  console.log(req.body);

  const token = req.headers.token;

  const results = await asyncPgSQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = results[0].user_id;

  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  let debitErrors = await validate(req.body, "debit");

  // log local errors if any
  console.log(debitErrors);

  // notify about validation errors and abort if any
  if (debitErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  //   destructuring the body
  const { amount } = req.body;

  const accountId = (await asyncPgSQL(
    `SELECT id FROM accounts WHERE user_id = ?`,
    [userId]
  )) as any;

  // console.log(accountId[0].id);

  const transaction = {
    type: "received",
    details: "debit card pay in",
    amount,
    accountId: Number(accountId[0].id),
  };

  // validate
  let transactionErrors = await validate(transaction, "addTransaction");

  // log local errors if any
  console.log(transactionErrors);

  // notify about validation errors and abort if any
  if (transactionErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  // implementing the query
  try {
    await asyncPgSQL(addTransaction(), [
      transaction.type,
      transaction.details,
      amount,
      String(transaction.accountId),
    ]);

    const result = await asyncPgSQL(
      `UPDATE accounts SET balance = balance + ? WHERE id = ?`,
      [amount, transaction.accountId]
    );

    console.log(result);

    // notifying the front of successful result
    res.send({ status: 1, message: "Transaction added" });
    return;
  } catch (error) {
    // error message to the front
    res.send({ status: 0, reason: (error as any)?.sqlMessage });
    return;
  }
});

// // POST ROUTE:
// // add transaction router
router.post("/pay", async (req, res) => {
  // just console log the body
  console.log(req.body);

  const token = req.headers.token;

  const results = await asyncPgSQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = results[0].user_id;

  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  let paymentErrors = await validate(req.body, "pay");

  // log local errors if any
  console.log("errors are", paymentErrors);

  // notify about validation errors and abort if any
  if (paymentErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  console.log("validated");

  //   destructuring the body
  const { amount, payeeName } = req.body;

  const accountId = (await asyncPgSQL(
    `SELECT id FROM accounts WHERE user_id = ?`,
    [userId]
  )) as any;

  console.log(accountId[0].id);

  const transaction = {
    type: "sent",
    details: payeeName,
    amount,
    accountId: Number(accountId[0].id),
  };

  // validate
  let transactionErrors = await validate(transaction, "addTransaction");

  // log local errors if any
  console.log(transactionErrors);

  // notify about validation errors and abort if any
  if (transactionErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  // implementing the query
  try {
    const rawResult = await asyncPgSQL(
      `UPDATE accounts SET balance = balance - ? WHERE id = ? AND balance >= ?`,
      [amount, transaction.accountId, amount]
    );

    const result = rawResult as unknown as OkPacket;

    console.log(result);

    if (result.changedRows !== 1) {
      // Send an error response if the balance wasn't updated.
      res.send({
        status: 0,
        reason: "Transaction failed, possibly due to insufficient funds",
      });
      return;
    }

    await asyncPgSQL(addTransaction(), [
      transaction.type,
      transaction.details,
      amount,
      String(transaction.accountId),
    ]);

    // notifying the front of successful result
    res.send({ status: 1, message: "Transaction added" });
    return;
  } catch (error) {
    // error message to the front
    res.send({ status: 0, reason: "Something has gone wrong" });
    return;
  }
});

// exporting the router
export { router };
