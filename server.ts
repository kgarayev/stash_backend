// importing express framework and types
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

// import session
// import session from "express-session";

// const MySQLStore = require("express-mysql-session")(session);

// MySQL options
// let options = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
//   database: "stash",
// };

// Set up MySQL session store
// let sessionStore = new MySQLStore(options);

// importing check token middleware function
import { checkToken } from "./middleware/auth";

// import limiter
import { limiter } from "./middleware/limiter";

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

myApp.use(limiter);

// helmet middleware
myApp.use(helmet());

// disable fingerprinting
myApp.disable("x-powered-by");

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

myApp.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["Content-Length", "Token"],
  })
);


myApp.use(cookieParser());

// handle static files
myApp.use(express.static("public"));

// json body parser middleware to read the body
myApp.use(express.json());

// a logging middleware
myApp.use(logging);

// Use express-session
// myApp.use(
//   session({
//     secret: process.env.SESSION_SECRET || "defaultSecret",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true, // prevents client JavaScript from accessing cookies
//       secure: true, // Set this to true if you're using HTTPS
//       maxAge: 15 * 60 * 1000, // 15 minutes
//       sameSite: "strict", // helps protect against CSRF attacks
//     },
//   })
// );

// API KEY validation middleware
// myApp.use(simpleAuth);

// view users route middleware
// myApp.use("/generic", genericRouter);

// view users route middleware
myApp.use("/user", userRouter);

// view accounts route middleware
// myApp.use("/account", accountRouter);

// view transactions route middleware
// myApp.use("/transaction", transactionRouter);

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
