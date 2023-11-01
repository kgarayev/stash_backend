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

  const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

  // Check if the token is valid and has corresponding userId
  if (!tokenResults.rows || tokenResults.rows.length === 0) {
    res.send({ status: 0, reason: "No results or id not found" });
    return;
  }

  const userId = tokenResults.rows[0].user_id;

  console.log(userId);

  try {
    const transactionResults = await asyncPgSQL(
      `SELECT * FROM transactions WHERE account_id IN (SELECT id FROM accounts WHERE user_id = $1)`,
      [userId]
    );

    // Using `rows` property to access results
    if (transactionResults.rows.length > 0) {
      res.send({ status: 1, results: transactionResults.rows });
      return;
    } else {
      res.send({ status: 0, reason: "No transactions found for user" });
      return;
    }
  } catch (e) {
    console.error(e); // Enhanced error logging
    res.send({
      status: 0,
      reason: "An error occurred while fetching transactions",
    });
  }
});

// // POST ROUTE:
// // add transaction router
router.post("/receive", async (req, res) => {
  // just console log the body
  console.log(req.body);

  const token = req.headers.token;

  const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

  console.log(tokenResults);

  if (!tokenResults.rows || tokenResults.rows.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = tokenResults.rows[0].user_id;

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

  const accountIdResult = await asyncPgSQL(
    `SELECT id FROM accounts WHERE user_id = $1`,
    [userId]
  );

  // Check if accountIdResult.rows is not empty and has an 'id'
  if (
    !accountIdResult.rows ||
    accountIdResult.rows.length === 0 ||
    !accountIdResult.rows[0].id
  ) {
    res.send({ status: 0, reason: "Account ID not found for the user" });
    return;
  }

  const accountId = accountIdResult.rows[0].id;

  // console.log(accountId[0].id);

  // Use accountId in your transaction object
  const transaction = {
    type: "received",
    details: "debit card pay in",
    amount,
    accountId: accountId, // Here, use the id directly
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
      `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
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

  const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

  console.log(tokenResults);

  if (!tokenResults.rows || tokenResults.rows.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  const userId = tokenResults.rows[0].user_id;

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

  const accountResult = await asyncPgSQL(
    `SELECT id FROM accounts WHERE user_id = $1`,
    [userId]
  );

  // Make sure accountResult.rows exists and has at least one row
  if (!accountResult.rows || accountResult.rows.length === 0) {
    res.send({ status: 0, reason: "Account not found for the user" });
    return;
  }

  const accountId = accountResult.rows[0].id;

  console.log("account id is:", accountId);

  const transaction = {
    type: "sent",
    details: payeeName,
    amount,
    accountId: Number(accountId),
  };

  console.log(transaction);

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
      `UPDATE accounts SET balance = balance - $1 WHERE id = $2 AND balance >= $3`,
      [amount, transaction.accountId, amount]
    );

    // Check `rowCount` here
    if (rawResult.rowCount !== 1) {
      res.send({
        status: 0,
        reason: "Transaction failed, possibly due to insufficient funds",
      });
      return;
    }

    const updatedRows = rawResult.rows;

    const result = rawResult as unknown as OkPacket;

    console.log(result);

    const currentBalance = (await asyncPgSQL(
      `SELECT balance FROM accounts WHERE id = $1`,
      [accountId]
    )) as any;

    console.log(
      "Current Balance for Account ID",
      accountId,
      ":",
      currentBalance
    );

    const transResult = await asyncPgSQL(addTransaction(), [
      transaction.type,
      transaction.details,
      amount,
      String(transaction.accountId),
    ]);

    console.log(transResult);

    // notifying the front of successful result
    res.send({ status: 1, message: "Transaction added" });
    return;
  } catch (error) {
    console.log(error);

    // error message to the front
    res.send({ status: 0, reason: "Something has gone wrong" });
    return;
  }
});

// exporting the router
export { router };
