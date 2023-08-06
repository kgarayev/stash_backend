import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";
import cookieParser from 'cookie-parser';
import session from 'express-session'; // Import express-session

import { SessionData } from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    userId?: number;
  }
}


// importing express framework and types
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const authorise = async (req: Request, res: Response, next: NextFunction) => {
    // Check for user ID in session first
    if (req.session?.userId) {
      req.validatedUserId = req.session.userId;
      next();
      return;
  } else {
      res.status(401).send("Not authenticated");
      return;
  }
  //   // get the token from the cookies instead of the headers
  //   const token = req.cookies.token;

  //   if (!token) {
  //     res.send({ status: 0, reason: "no token provided" });
  //     return;
  //   }

  // const results = await asyncMySQL(getIdByToken(token));

  // console.log(results);

  // if (results.length > 0) {
  //   // attach token id to the request
  //   req.validatedUserId = results[0].user_id;
  //   req.session.userId = results[0].user_id; // Store user ID in session

  //   next();
  //   return;
  // }

  // res.send({ status: 0, reason: "bad token" });
};

export { authorise };
