// IMPORTING STUFF:
// import express
import express from "express";

// import router
const router = express.Router();

// importing the random id generator function
import { genRandomString } from "../utils/math";

// importing joi validator
import { validate } from "../validation/index";

// import asyncMySQL function
import { asyncMySQL } from "../database/connection";

// import queries
import { queries } from "../database/queries";
import { OkPacket } from "mysql";

const { addTransaction, deleteQuery, updateQuery, getQuery } = queries;

interface DatabaseEntry {
  id?: number;
  first_name?: string;
  last_name?: string;
  number?: string;
  email?: string;
  dob?: Date | string;
  password?: string;
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
  const userId = (req.session as any).userId;
  // console.log(req.session);

  // Check if the current user is authorized to access the account
  if (!userId) {
    res.send({ status: 0, reason: "Unauthorised" });
    return;
  }

  // ask sql for data
  // returns an array of results
  try {
    const results = (await asyncMySQL(
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
  // console.log(req.body);
  const userId = (req.session as any).userId;

  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  let debitErrors = await validate(req.body, "debit");

  // log local errors if any
  // console.log(debitErrors);

  // notify about validation errors and abort if any
  if (debitErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  //   destructuring the body
  const { amount } = req.body;

  const accountId = (await asyncMySQL(
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
  // console.log(transactionErrors);

  // notify about validation errors and abort if any
  if (transactionErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  // implementing the query
  try {
    await asyncMySQL(addTransaction(), [
      transaction.type,
      transaction.details,
      amount,
      String(transaction.accountId),
    ]);

    const result = await asyncMySQL(
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
  // console.log(req.body);
  const userId = (req.session as any).userId;

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

  const accountId = (await asyncMySQL(
    `SELECT id FROM accounts WHERE user_id = ?`,
    [userId]
  )) as any;

  // console.log(accountId[0].id);

  const transaction = {
    type: "sent",
    details: payeeName,
    amount,
    accountId: Number(accountId[0].id),
  };

  // validate
  let transactionErrors = await validate(transaction, "addTransaction");

  // log local errors if any
  // console.log(transactionErrors);

  // notify about validation errors and abort if any
  if (transactionErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  // implementing the query
  try {
    const rawResult = await asyncMySQL(
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

    await asyncMySQL(addTransaction(), [
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

// // DELETE ROUTE:
// // delete a transaction router
// router.delete("/:id", async (req, res) => {
//   // converting id from string to number
//   const id = Number(req.params.id);

//   // check if the id is number
//   if (Number.isNaN(id)) {
//     res.send({ status: 0, reason: "Invalid id" });
//     return;
//   }

//   try {
//     // run the query
//     const result = (await asyncMySQL(deleteQuery("transactions", id))) as any;

//     console.log(result);

//     // check if the id exists and the transaction has been removed
//     if (result.affectedRows === 1) {
//       // send the successful update to the front
//       res.send({ status: 1, message: "Transaction removed" });
//       return;
//     }
//     // if not, notify the front
//     res.send({ status: 0, message: "Invalid id" });
//     return;
//   } catch (error) {
//     // catch the error
//     res.send({ status: 0, reason: (error as any)?.sqlMessage });
//     return;
//   }
// });

// // UPDATE ROUTE:
// // router to update the transaction information
// router.patch("/:id", async (req, res) => {
//   // convert id from string to number
//   const id = Number(req.params.id);

//   // validate
//   let localErrors = await validate(req.body, "updateTransaction");

//   // logging local errors
//   // console.log(localErrors);

//   // checking if local errors exist
//   if (localErrors) {
//     res.send({ status: 0, reason: "Incomplete or invalid request" });
//     return;
//   }

//   //   destructuring the body
//   const { type, details, amount, accountId } = req.body;

//   try {
//     // First, check if transaction with this id exists
//     const results = (await asyncMySQL(
//       `SELECT * FROM transactions WHERE id LIKE "${id}"`
//     )) as DatabaseEntry[];

//     // If no transaction exists with this id, return an error
//     if (results.length === 0) {
//       res.send({ status: 0, message: "Invalid transaction id" });
//       return;
//     }

//     //   for security we have repetition
//     if (type && typeof type === "string") {
//       await asyncMySQL(updateQuery("transactions", "type", type, id));
//     }

//     if (details && typeof details === "string") {
//       await asyncMySQL(updateQuery("transactions", "details", details, id));
//     }

//     if (amount && typeof Number(amount) === "number") {
//       await asyncMySQL(updateQuery("transactions", "amount", amount, id));
//     }

//     if (accountId && typeof Number(accountId) === "number") {
//       await asyncMySQL(
//         updateQuery("transactions", "account_id", accountId, id)
//       );
//     }

//     // sending the final update to the front
//     res.send({ status: 1, message: "Transaction updated" });
//     return;
//   } catch (error) {
//     // catch errors if any
//     res.send({ status: 0, reason: (error as any)?.sqlMessage });
//     return;
//   }
// });

// exporting the router
export { router };
