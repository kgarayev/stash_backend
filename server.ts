// importing express framework and types
import express, { Request, Response, NextFunction } from "express";

interface Error {
  status?: number;
  message?: string;
}

// importing helmet
import helmet from "helmet";

// import middleware functions
import { logging } from "./middleware/logging";

// import simpleAuth from "./middleware/simpleAuth";

// importing the random id generator function
// import { genRandomString } from "./utils/math";

// to temporarily fix an error
import cors from "cors";

// importing routes
// import { router as genericRouter } from "./routes/generic";
import { router as userRouter } from "./routes/user";
import { router as accountRouter } from "./routes/account";
import { router as transactionRouter } from "./routes/transaction";

// creating a new instance of express
const myApp = express();

// Middleware section START

// helmet middleware
myApp.use(helmet());

// disable fingerprinting
myApp.disable("x-powered-by");

myApp.use(cors()); //just fixes it for now!!!

// handle static files
myApp.use(express.static("public"));

// json body parser middleware to read the body
myApp.use(express.json());

// a logging middleware
myApp.use(logging);

// API KEY validation middleware
// myApp.use(simpleAuth);

// view users route middleware
// myApp.use("/generic", genericRouter);

// view users route middleware
myApp.use("/user", userRouter);

// view accounts route middleware
myApp.use("/account", accountRouter);

// view transactions route middleware
myApp.use("/transaction", transactionRouter);

// custom 404
myApp.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("Sorry can't find that!");
});

// custom error handler
myApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).send("Something broke!");
});

// Mddleware section FINISH

// ability to choose available port to use
// good practice
const PORT = process.env.PORT || 6001;

// to start the server
myApp.listen(PORT, () => {
  console.log("The server is now running!");
});
