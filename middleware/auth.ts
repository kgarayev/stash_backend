import { queries } from "../database/queries";
import { asyncPgSQL } from "../database/connection";
import { Request as ExpressRequest, Response, NextFunction } from "express";

interface Request extends ExpressRequest {
  validatedUserId?: number;
}

const { getIdByToken } = queries;

// create a function that checks the token provided by the client
const authorise = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;

  const tokenResults = await asyncPgSQL(getIdByToken(), [token]);

  console.log(tokenResults);

  // Changed from `results` to `tokenResults.rows` to access the query result
  if (!tokenResults.rows || tokenResults.rows.length === 0) {
    res.send({ status: 0, reason: "No results found" });
    return;
  }

  // Changed to check the length of `tokenResults.rows`
  if (tokenResults.rows.length === 1) {
    const entryDate = new Date(tokenResults.rows[0].entry_date);
    const maxAge = tokenResults.rows[0].max_age; // In milliseconds

    // Calculate the expiry time of the token.
    const expiryDate = new Date(entryDate.getTime() + maxAge);
    const currentDate = new Date();
    if (currentDate > expiryDate) {
      try {
        await asyncPgSQL(`DELETE FROM tokens WHERE token = $1`, [token]);
        return res.send({ status: 0, reason: "Token has expired" });
      } catch (e) {
        console.log("Something has gone wrong");
        res.send({ status: 0, reason: "Error processing token" });
      }
    }

    // Assign user_id from the token's result
    req.validatedUserId = tokenResults.rows[0].user_id;
    next();
    return;
  }

  return res.send({ status: 0, reason: "Not authorised" });
};

export { authorise };
