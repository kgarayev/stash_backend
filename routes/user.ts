// IMPORTING STUFF:
// import express
import express from "express";

import session from "express-session";

// import dotenv
import dotenv from "dotenv";
dotenv.config();

// importing jwt
// import jwt from "jsonwebtoken";

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

// import router
const router = express.Router();

const {
  addUser,
  deleteQuery,
  updateQuery,
  getQuery,
  checkUserCreds,
  addToken,
} = queries;

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
  // just console log the body
  // console.log("request body: ", req.body);
  // console.log("password only: ", req.body.password);

  // validate
  let localErrors = await validate(req.body, "addUser");

  // log local errors if any
  // console.log("errors: ", localErrors);

  // notify about validation errors and abort if any
  if (localErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  //   destructuring the body
  const { firstName, lastName, number, email, dob, password } = req.body;

  // creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  // console.log(hashedPassword);

  // implementing the query
  try {
    await asyncMySQL(
      addUser(firstName, lastName, number, email, dob, hashedPassword)
    );
    // notifying the user of successful result
    res.send({ status: 1, message: "User added" });
    return;
  } catch (error) {
    // error message to the front
    res.send({
      status: 0,
      reason: (error as any)?.sqlMessage || "Something wrong",
    });
    return;
  }
});

// LOGIN POST ROUTE
// log user in
router.post("/login", async (req, res) => {
  // just console log the body
  // console.log("request body: ", req.body);
  // console.log("password only: ", req.body.password);

  // validate
  let localErrors = await validate(req.body, "loginUser");

  // log local errors if any
  console.log("errors: ", localErrors);

  // notify about validation errors and abort if any
  if (localErrors) {
    res.send({ status: 0, reason: "Incomplete or invalid request" });
    return;
  }

  //   destructuring the body
  const { email, password } = req.body;

  // creating a password hash with a salt
  const hashedPassword = hash256(password + "stashSalt-2023?");

  // console.log(hashedPassword);
  // implementing the query
  try {
    // return something if there is amatch
    const results = await asyncMySQL(checkUserCreds(email, hashedPassword));

    // if there is something, generate a token
    if (results.length > 0) {
      // generating a token
      const token = genRandomString(128);

      // Generate a JWT with a payload of the user's ID
      // const token = jwt.sign(
      //   { userId: results[0].id },
      //   process.env.JWT_SECRET_KEY
      // );

      // Set the JWT as a secure, HttpOnly cookie
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true, // this should be set to true in a production environment
      //   maxAge: 15 * 60 * 1000, // 15 mins
      // });

      // add a token into a tokens table
      await asyncMySQL(addToken(results[0].id, token));

      // send status and token to the front
      res.cookie("name", "tobi", {
        domain: "localhost",
        path: "/",
        secure: false,
      });
      // res.cookie("token", token);
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
      reason: (error as any)?.sqlMessage || "Something wrong",
    });
    return;
  }
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
