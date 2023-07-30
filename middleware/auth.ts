import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";

// importing express framework and types
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const results = await asyncMySQL(getIdByToken(req.headers.token));

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
