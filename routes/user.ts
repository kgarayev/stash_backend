// IMPORTING STUFF:
// import express
import express from "express";

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
import { asyncPgSQL } from "../database/connection";

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
  getIdByToken,
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

// REGISTER POST ROUTE:
// add user router
router.post("/register", async (req, res) => {
  // validate
  let localErrors = await validate(req.body, "addUser");

  console.log(localErrors);

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

  // destructuring the body
  const { firstName, lastName, number, email, dob, password } = req.body;

  // creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  // Implementing the user addition query
  try {
    await asyncPgSQL(addUser(), [
      firstName,
      lastName,
      number,
      email,
      dob,
      hashedPassword,
    ]);

    // Check user credentials to retrieve the user ID
    try {
      const userResults = await asyncPgSQL(checkUserCreds(), [
        email,
        hashedPassword,
      ]);

      if (!userResults.rows || userResults.rows.length === 0) {
        throw new Error("User not found after registration.");
      }

      const userId = userResults.rows[0].id;

      // Fetching account details
      const { accountNumber, sortCode } = await accountDetails();

      // Creating an account for the user
      const sqlResponse = await asyncPgSQL(addAccount(), [
        "current account",
        accountNumber,
        sortCode,
        "gbp",
        "british pound",
        "£",
        "UK",
        "0",
        userId.toString(),
      ]);

      console.log(sqlResponse);

      // Notifying the user of successful registration
      res.send({ status: 1, message: "User added" });
    } catch (e) {
      console.log(e);
      res.send({ status: 0, message: "something wrong" });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: 0, reason: "Something wrong" });
  }
});

// LOGIN POST ROUTE
// log user in
// router.post("/login", async (req, res) => {
//   // Check for malicious patterns
//   for (let key in req.body) {
//     if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
//       res.send("Hacker identified!");
//       return;
//     }
//   }

//   // Check for token in headers
//   const token = req.headers.token;

//   if (token) {
//     // If token exists, verify it
//     const results = await asyncPgSQL(getIdByToken(), [token]);

//     // If token is valid
//     if (results && results.length > 0) {
//       res.send({ status: 1, token });
//       return;
//     }
//   }

//   try {
//     // validate
//     let localErrors = await validate(req.body, "loginUser");

//     // log local errors if any
//     console.log("errors: ", localErrors);

//     // notify about validation errors and abort if any
//     if (localErrors) {
//       res.send({ status: 0, reason: "Incomplete or invalid request" });
//       return;
//     }
//   } catch (e) {
//     console.log(e);
//     res.send({ status: 0, reason: "something gone wrong" });
//   }

//   for (let key in req.body) {
//     if (req.body[key].includes("%")) {
//       res.send("Hacker identified!");
//       return;
//     }
//   }

//   //   destructuring the body
//   const { email, password } = req.body;

//   // creating a password hash with a salt
//   const hashedPassword = hash256(password + "stashSalt-2023?");

//   console.log(hashedPassword);

//   // implementing the query
//   try {
//     // return something if there is amatch
//     const results = await asyncPgSQL(checkUserCreds(), [email, hashedPassword]);

//     // if there is something, generate a token
//     if (results.length === 1) {
//       // generating a token
//       const token = genRandomString(128);

//       console.log("token:", token);

//       // max age in milliseconds = 30 mins
//       const maxAge = 1800000;

//       // add a token into a tokens table
//       await asyncPgSQL(addToken(), [results[0].id, token, maxAge]);

//       res.send({ status: 1, token });
//       return;
//     } else {
//       res.send({ status: 0, reason: "invalid credentials" });
//       return;
//     }
//   } catch (error) {
//     // error message to the front
//     console.log(error);

//     // send the response to the front
//     res.send({
//       status: 0,
//       reason: "Something wrong",
//     });
//     return;
//   }
//   return;
// });

// LOGIN POST ROUTE
// log user in
// LOGIN POST ROUTE
// log user in
router.post("/login", async (req, res) => {
  // Check for malicious patterns
  for (let key in req.body) {
    if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
      res.send("Hacker identified!");
      return;
    }
  }

  // Check for token in headers
  const token = req.headers.token;

  if (token) {
    // If token exists, verify it
    const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

    // If token is valid
    if (tokenResults.rows && tokenResults.rows.length > 0) {
      res.send({ status: 1, token });
      return;
    }
  }

  try {
    // validate
    let localErrors = await validate(req.body, "loginUser");

    // log local errors if any
    console.log("errors: ", localErrors);

    // notify about validation errors and abort if any
    if (localErrors) {
      res.send({ status: 0, reason: "Incomplete or invalid request" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.send({ status: 0, reason: "something gone wrong" });
  }

  // Destructuring the body to get email and password
  const { email, password } = req.body;

  // Creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  console.log(hashedPassword);

  // implementing the query
  try {
    // return something if there is a match
    const userResults = await asyncPgSQL(checkUserCreds(), [
      email,
      hashedPassword,
    ]);

    // if there is something, generate a token
    if (userResults.rows.length === 1) {
      // generating a token
      const token = genRandomString(128);

      // max age in milliseconds = 30 mins
      const maxAge = 1800000;

      // add a token into a tokens table
      await asyncPgSQL(addToken(), [userResults.rows[0].id, token, maxAge]);

      res.send({ status: 1, token });
      return;
    } else {
      res.send({ status: 0, reason: "invalid credentials" });
      return;
    }
  } catch (error) {
    // error handling
    console.log(error);
    res.send({ status: 0, reason: "Something wrong" });
    return;
  }
});

// LOG OUT POST ROUTE
router.post("/logout", async (req, res) => {
  const token = req.headers.token;

  console.log(token);

  // Check for token validation
  const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

  console.log(tokenResults);

  if (!tokenResults.rows || tokenResults.rows.length === 0) {
    res.send({ status: 0, reason: "No user found" });
    return;
  }

  try {
    // Before proceeding with logout, check for any malicious patterns
    for (let key in req.body) {
      if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
        res.send("Hacker identified!");
        return;
      }
    }

    // Perform the logout action
    const deleteResult = await asyncPgSQL(
      `DELETE FROM tokens WHERE token = $1`,
      [token]
    );

    res.send({ status: 1, message: "Logged out successfully" });
  } catch (e) {
    console.log(e);
    res.send({ status: 0, message: "something has gone wrong" });
  }
});

// exporting the router
export { router };
