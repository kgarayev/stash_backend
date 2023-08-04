import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";
import cookieParser from 'cookie-parser';

// importing express framework and types
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    // get the token from the cookies instead of the headers
    const token = req.cookies.token;

    if (!token) {
      res.send({ status: 0, reason: "no token provided" });
      return;
    }

  const results = await asyncMySQL(getIdByToken(token));

  console.log(results);

  if (results.length > 0) {
    // attach token id to the request
    req.validatedUserId = results[0].user_id;

    next();
    return;
  }

  res.send({ status: 0, reason: "bad token" });
};

export { checkToken };
