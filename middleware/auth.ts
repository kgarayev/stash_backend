import { queries } from "../database/queries";
import { asyncMySQL } from "../database/connection";
import cookieParser from "cookie-parser";
import session from "express-session"; // Import express-session

import { SessionData } from "express-session";

declare module "express-session" {
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
  try {
    if (req.session?.userId) {
      req.validatedUserId = req.session.userId;
      return next();
    }

    const token = req.cookies.token;
    if (!token) {
      return res.send({ status: 0, reason: "no token provided" });
    }

    const results = await asyncMySQL(getIdByToken(), [token]);

    if (results.length > 0) {
      req.validatedUserId = results[0].user_id;
      req.session.userId = results[0].user_id;
      return next();
    } else {
      req.session.destroy((error) => {
        if (error) {
          return res.send({ status: 0, message: "Internal Server Error" });
        }
      });
      return res.send({ status: 0, reason: "Not authorised" });
    }
  } catch (error) {
    console.error("Error in authorise middleware:", error);
    return res.send({ status: 0, message: "Internal Server Error" });
  }
};

export { authorise };
