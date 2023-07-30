import { Request, Response, NextFunction } from "express";

// define the API KEY
const apiKey = "abcd1234";

// define the simple authentication function for middleware
const simpleAuth = (req: Request, res: Response, next: NextFunction) => {
  // defensive check to see if the API KEY entered matches the one in the system
  if (req.headers.api_key === apiKey) {
    // proceed if matches
    next();
  } else {
    // do not allow to proceed but respond
    return res.send("Sorry, bad API key");
  }
};

export { simpleAuth };
