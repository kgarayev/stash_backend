import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const authorise = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;

  const results = await asyncMySQL(getIdByToken(), [token]);

  console.log(results);

  if (!results || results.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  if (results.length === 1) {
    const entryDate = new Date(results[0].entry_date);
    const maxAge = results[0].max_age; // This is in milliseconds based on your info.

    // Calculate the expiry time of the token.
    const expiryDate = new Date(entryDate.getTime() + maxAge);

    // Compare the expiry time with the current time.
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      try {
        const result = await asyncMySQL(`DELETE * FROM tokens WHERE token=?`, [
          token,
        ]);

        return res.send({ status: 0, reason: "Token has expired" });
      } catch (e) {
        console.log("Something has gone wrong");
        res.send({ status: 0, reason: "No results found" });
      }
    }

    req.validatedUserId = results[0].user_id;
    next();
    return;
  }
  return res.send({ status: 0, reason: "Not authorised" });
};

export { authorise };
