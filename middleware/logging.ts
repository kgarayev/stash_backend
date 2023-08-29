import { Request, Response, NextFunction } from "express";

// define logging function for middleware
const logging = (req: Request, res: Response, next: NextFunction) => {
  // show the date and the path
  console.log(new Date(), req.path);
  console.log("logging middleware");

  // allow the request to proceed
  next();
};

export { logging };
