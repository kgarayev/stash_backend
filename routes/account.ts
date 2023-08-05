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

const { addAccount, deleteQuery, updateQuery, getQuery } = queries;

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

// GET ROUTE:
// get a specific account router
router.get("/", async (req, res) => {
  // convert id from string to number
  // const id = Number(req.params.id);

  console.log(req.session);
  

  // Check if the current user is authorized to access the account
  if (!req.session.userId) {
    res.send({ status: 0, reason: "Unauthorised" });
    return;
  }

  // check if the id is number
  // if (Number.isNaN(id)) {
  //   res.send({ status: 0, reason: "Invalid id" });
  //   return;
  // }

  // ask sql for data
  // returns an array of results
  const results = (await asyncMySQL(
    `SELECT * FROM accounts WHERE user_id LIKE "${req.session.userId}"`
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

  // if the resuts are not there, communicate this
  res.send({ status: 0, reason: "Id not found" });
});

// POST ROUTE:
// add account router
// router.post("/", async (req, res) => {
//   // just console log the body
//   console.log(req.body);

//   // validate
//   let localErrors = await validate(req.body, "addAccount");

//   // log local errors if any
//   console.log(localErrors);

//   // notify about validation errors and abort if any
//   if (localErrors) {
//     res.send({ status: 0, reason: "Incomplete or invalid request" });
//     return;
//   }

//   //   destructuring the body
//   const {
//     accountName,
//     accountNumber,
//     sortCode,
//     currencyCode,
//     currencyName,
//     currencySymbol,
//     currencyCountry,
//     balance,
//     userId,
//   } = req.body;

//   // implementing the query
//   try {
//     await asyncMySQL(
//       addAccount(
//         accountName,
//         accountNumber,
//         sortCode,
//         currencyCode,
//         currencyName,
//         currencySymbol,
//         currencyCountry,
//         balance,
//         userId
//       )
//     );
//     // notifying the front of successful result
//     res.send({ status: 1, message: "Account added" });
//     return;
//   } catch (error) {
//     // error message to the front
//     res.send({ status: 0, reason: (error as any)?.sqlMessage });
//     return;
//   }
// });

// DELETE ROUTE:
// delete an account router
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
//     const result = (await asyncMySQL(deleteQuery("accounts", id))) as any;

//     console.log(result);

//     // check if the id exists and the account has been removed
//     if (result.affectedRows === 1) {
//       // send the successful update to the front
//       res.send({ status: 1, message: "Account removed" });
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

// UPDATE ROUTE:
// router to update the account information
// router.patch("/:id", async (req, res) => {
//   // convert id from string to number
//   const id = Number(req.params.id);

//   // validate
//   let localErrors = await validate(req.body, "updateAccount");

//   // checking if local errors exist
//   if (localErrors) {
//     res.send({ status: 0, reason: "Incomplete or invalid request" });
//     return;
//   }

//   //   destructuring the body
//   const {
//     accountName,
//     accountNumber,
//     sortCode,
//     currencyCode,
//     currencyName,
//     currencySymbol,
//     currencyCountry,
//     balance,
//     userId,
//   } = req.body;

//   try {
//     // First, check if account with this id exists
//     const results = (await asyncMySQL(
//       `SELECT * FROM accounts WHERE id LIKE "${id}"`
//     )) as DatabaseEntry[];

//     // If no account exists with this id, return an error
//     if (results.length === 0) {
//       res.send({ status: 0, message: "Invalid account id" });
//       return;
//     }

//     //   for security we have repetition
//     if (accountName && typeof accountName === "string") {
//       await asyncMySQL(
//         updateQuery("accounts", "account_name", accountName, id)
//       );
//     }

//     if (accountNumber && typeof Number(accountNumber) === "number") {
//       await asyncMySQL(
//         updateQuery("accounts", "account_number", accountNumber, id)
//       );
//     }

//     if (sortCode && typeof Number(sortCode) === "number") {
//       await asyncMySQL(updateQuery("accounts", "sort_code", sortCode, id));
//     }

//     if (currencyCode && typeof currencyCode === "string") {
//       await asyncMySQL(
//         updateQuery("accounts", "currency_code", currencyCode, id)
//       );
//     }

//     if (currencyName && typeof currencyName === "string") {
//       await asyncMySQL(
//         updateQuery("accounts", "currency_name", currencyName, id)
//       );
//     }

//     if (currencySymbol && typeof currencySymbol === "string") {
//       await asyncMySQL(
//         updateQuery("accounts", "currency_symbol", currencySymbol, id)
//       );
//     }

//     if (currencyCountry && typeof currencyCountry === "string") {
//       await asyncMySQL(
//         updateQuery("accounts", "currency_country", currencyCountry, id)
//       );
//     }

//     if (balance && typeof Number(balance) === "number") {
//       await asyncMySQL(updateQuery("accounts", "balance", balance, id));
//     }

//     if (userId && typeof Number(userId) === "number") {
//       await asyncMySQL(updateQuery("accounts", "user_id", userId, id));
//     }

//     // sending the final update to the front
//     res.send({ status: 1, message: "Account updated" });
//     return;
//   } catch (error) {
//     // catch errors if any
//     res.send({ status: 0, reason: (error as any)?.sqlMessage });
//     return;
//   }
// });

// exporting the router
export { router };
