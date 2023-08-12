// IMPORTING STUFF:
// import express
import express from "express";

import session from "express-session";

// import dotenv
import dotenv from "dotenv";
dotenv.config();

// importing the random id generator function
import { genRandomString } from "../utils/math";

// importimport a hashing function
import { hash256 } from "../utils/hash";

// importing joi validator
import { validate } from "../validation/index";

// import asyncMySQL function
import { asyncMySQL } from "../database/connection";

// import queries
import { queries } from "../database/queries";

// importing account details function
import { accountDetails } from "../utils/accountDetails";

// import router
const router = express.Router();

const {
  addUser,
  deleteQuery,
  updateQuery,
  getQuery,
  checkUserCreds,
  addToken,
  addAccount,
} = queries;

interface SessionData {
  userId?: number; // Add the properties you want here
}

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

// REGISTER POST ROUTE:
// add user router
router.post("/register", async (req, res) => {
  // validate
  let localErrors = await validate(req.body, "addUser");

  // notify about validation errors and abort if any
  if (localErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  //   destructuring the body
  const { firstName, lastName, number, email, dob, password } = req.body;

  // creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  // console.log(hashedPassword);

  // implementing the query
  try {
    await asyncMySQL(addUser(), [
      firstName,
      lastName,
      number,
      email,
      dob,
      hashedPassword,
    ]);

    // automatically creating an account for the user
    // implementing the query

    try {
      const { accountNumber, sortCode } = await accountDetails();
      const results = await asyncMySQL(checkUserCreds(), [
        email,
        hashedPassword,
      ]);

      const userId = results[0].id;

      // console.log(userId);

      const sqlResponse = await asyncMySQL(addAccount(), [
        "current account",
        accountNumber,
        sortCode,
        "gbp",
        "british pound",
        "£",
        "UK",
        "0",
        String(userId),
      ]);

      console.log(sqlResponse);

      // notifying the user of successful result
      res.send({ status: 1, message: "User added" });
      return;
    } catch (e) {
      console.log(e);
      res.send({ status: 0, message: "something wrong" });
    }
    return;
  } catch (error) {
    // error message to the front
    console.log(error);

    res.send({
      status: 0,
      reason: "Something wrong",
    });
    return;
  }
});

// LOGIN POST ROUTE
// log user in
router.post("/login", async (req, res) => {
  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  try {
    // validate
    let localErrors = await validate(req.body, "loginUser");

    // log local errors if any
    // console.log("errors: ", localErrors);

    // notify about validation errors and abort if any
    if (localErrors) {
      res.send({ status: 0, reason: "Incomplete or invalid request" });
      return;
    }
  } catch (e) {
    // console.log(e);
    res.send({ status: 0, reason: "something gone wrong" });
  }

  for (let key in req.body) {
    if (req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  //   destructuring the body
  const { email, password } = req.body;

  // creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  // console.log(hashedPassword);

  // console.log(hashedPassword);
  // implementing the query
  try {
    // return something if there is amatch
    const results = await asyncMySQL(checkUserCreds(), [email, hashedPassword]);

    // if there is something, generate a token
    if (results.length === 1) {
      // generating a token
      // const token = genRandomString(128);

      (req.session as any).userId = results[0].id;
      req.session.save();
      // console.log(req.session);

      // max age in milliseconds = 15 mins
      // const maxAge = 900000;

      // add a token into a tokens table
      // await asyncMySQL(addToken(results[0].id, token, maxAge));

      // send status and token to the front
      // res.cookie("token", token, { maxAge: 900000, httpOnly: true, sameSite: 'strict', secure: true });

      res.send({ status: 1, message: "logged in" });
      return;
    } else {
      res.send({ status: 0, reason: "invalid credentials" });
      return;
    }
  } catch (error) {
    // error message to the front
    // console.log(error);

    // send the response to the front
    res.send({
      status: 0,
      reason: "Something wrong",
    });
    return;
  }
  return;
});

// LOG OUT POST ROUTE
router.post("/logout", (req, res) => {
  delete (req.session as any).userId;

  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }
  req.session.destroy((error) => {
    if (error) {
      // Handle error, e.g., send a 500 status or log the error
      // console.error("Session destroy error:", error);
      res.send({ status: 0, message: "Internal Server Error" });
      return;
    }

    // Clear the client-side cookie
    console.log("Attempting to clear the cookie...");
    res.clearCookie("connect.sid", { path: "/" });
    // console.log("Cookie should be cleared now.");

    // console.log(req.session);
    // console.log("session deleted");

    // Continue with your logout logic if there's no error
    res.send({ status: 1, message: "Logged out successfully" });
  }); // Destroys the session
});

// // GET ROUTE:
// // get user router
// router.get("/", async (req, res) => {
//   // ask sql for data
//   // returns an array of results
//   const results = await asyncMySQL(`SELECT * FROM users`);

//   res.send({ status: 1, results });
// });

// // GET ROUTE:
// // get a specific user router
// router.get("/:id", async (req, res) => {
//   // convert id from string to number
//   const id = Number(req.params.id);

//   // check if the id is number
//   if (Number.isNaN(id)) {
//     res.send({ status: 0, reason: "Invalid id" });
//     return;
//   }

//   // ask sql for data
//   // returns an array of results
//   const results = (await asyncMySQL(getQuery("users", id))) as DatabaseEntry[];

//   // check if the results are there
//   if (results.length > 0) {
//     res.send({ status: 1, results });
//     return;
//   }

//   // if the resuts are not there, communicate this
//   res.send({ status: 0, reason: "Id not found" });
// });

// // DELETE ROUTE:
// // delete a user router
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
//     const result = (await asyncMySQL(deleteQuery("users", id))) as any;

//     console.log(result);

//     // check if the id exists and the user has been removed
//     if (result.affectedRows === 1) {
//       // send the successful update to the user
//       res.send({ status: 1, message: "User removed" });
//       return;
//     }
//     // if not, notify the user
//     res.send({ status: 0, message: "Invalid id" });
//     return;
//   } catch (error) {
//     // catch the error
//     res.send({
//       status: 0,
//       reason: (error as any)?.sqlMessage || "Something wrong",
//     });
//     return;
//   }
// });

// // UPDATE ROUTE:
// // router to update the user information
// router.patch("/:id", async (req, res) => {
//   // convert id from string to number
//   const id = Number(req.params.id);

//   // validate
//   let localErrors = await validate(req.body, "updateUser");

//   // logging local errors
//   // console.log(localErrors);

//   // checking if local errors exist
//   if (localErrors) {
//     res.send({ status: 0, reason: "Incomplete or invalid request" });
//     return;
//   }

//   //   destructuring the body
//   const { firstName, lastName, number, email, dob, password } = req.body;

//   try {
//     // First, check if user with this id exists
//     const results = (await asyncMySQL(
//       `SELECT * FROM users WHERE id LIKE "${id}"`
//     )) as DatabaseEntry[];

//     // If no user exists with this id, return an error
//     if (results.length === 0) {
//       res.send({ status: 0, message: "Invalid user id" });
//       return;
//     }

//     //   for security we have repetition
//     if (firstName && typeof firstName === "string") {
//       await asyncMySQL(updateQuery("users", "first_name", firstName, id));
//     }

//     if (lastName && typeof lastName === "string") {
//       await asyncMySQL(updateQuery("users", "last_name", lastName, id));
//     }

//     if (number && typeof Number(number) === "number") {
//       await asyncMySQL(updateQuery("users", "number", number, id));
//     }

//     if (email && typeof email === "string") {
//       await asyncMySQL(updateQuery("users", "email", email, id));
//     }

//     if (dob && typeof dob === "string") {
//       await asyncMySQL(updateQuery("users", "dob", dob, id));
//     }

//     if (password && typeof password === "string") {
//       await asyncMySQL(updateQuery("users", "password", password, id));
//     }
//     // sending the final update to the user
//     res.send({ status: 1, message: "User updated" });
//     return;
//   } catch (error) {
//     // catch errors if any
//     res.send({
//       status: 0,
//       reason: (error as any)?.sqlMessage || "Something wrong",
//     });
//     return;
//   }
// });

// exporting the router
export { router };
