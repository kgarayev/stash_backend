// import express
import express from "express";

// import asyncMySQL function
import { asyncPgSQL } from "../database/connection";

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

// import router
const router = express.Router();

// // route
// router.get("/", async (req, res) => {
//   // log the headers of the request
//   console.log("New request to: /", req.headers);

//   // destructuring the request queries
//   let { num } = req.query;

//   console.log(num);

//   try {
//     var userQuantity = (
//       (await asyncMySQL(`SELECT COUNT(*) FROM users`)) as any
//     )[0]["COUNT(*)"];
//     console.log(userQuantity);
//   } catch (error) {
//     res.send({ status: 0, error });
//     return;
//   }

//   // if a specific quantity is asked for
//   if (Number(num) > 0 && Number(num) < userQuantity) {
//     const results = await asyncMySQL(`SELECT * FROM users LIMIT ${num}`);
//     res.send({ status: 1, results });
//     return;
//   } else if (Number(num) === 0) {
//     res.send({ status: 1, message: "No users requested" });
//     return;
//   } else if (Number(num) < 0) {
//     res.send({ status: 0, message: "Invalid query" });
//     return;
//   }

//   // otherwise, show all users
//   const results = await asyncMySQL(
//     `SELECT * FROM users
//       LEFT JOIN accounts
//         ON users.id=accounts.user_id
//           LEFT JOIN transactions
//             ON accounts.id=transactions.account_id`
//   );

//   // send the response to the front
//   res.send({ status: 1, results });
// });

export { router };
