import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";

// importing express framework and types
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const authorise = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;

  const results = await asyncMySQL(getIdByToken(), [token]);

  if (results.length === 0) {
    req.validatedUserId = results[0].user_id;

    next();
    return;
  }
  return res.send({ status: 0, reason: "Not authorised" });
};

export { authorise };
