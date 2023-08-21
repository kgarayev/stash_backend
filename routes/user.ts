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
    const results = await asyncMySQL(getIdByToken(), [token]);

    // If token is valid
    if (results && results.length > 0) {
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

  // implementing the query
  try {
    // return something if there is amatch
    const results = await asyncMySQL(checkUserCreds(), [email, hashedPassword]);

    // if there is something, generate a token
    if (results.length === 1) {
      // generating a token
      const token = genRandomString(128);

      console.log("token:", token);

      // max age in milliseconds = 30 mins
      const maxAge = 1800000;

      // add a token into a tokens table
      await asyncMySQL(addToken(), [results[0].id, token, maxAge]);

      res.send({ status: 1, token });
      return;
    } else {
      res.send({ status: 0, reason: "invalid credentials" });
      return;
    }
  } catch (error) {
    // error message to the front
    console.log(error);

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
router.post("/logout", async (req, res) => {
  const token = req.headers.token;

  console.log(token);

  const results = await asyncMySQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No user found" });
    return;
  }

  try {
    const results = await asyncMySQL(`DELETE FROM tokens WHERE token = ?`, [
      token,
    ]);

    for (let key in req.body) {
      if (typeof req.body[key] === "string" && req.body[key].includes("%")) {
        res.send("Hacker identified!");
        return;
      }
    }

    res.send({ status: 1, message: "Logged out successfully" });
  } catch (e) {
    console.log(e);
    res.send({ status: 0, message: "something has gone wrong" });
  }
});

// exporting the router
export { router };
