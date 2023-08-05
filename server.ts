// importing express framework and types
import express, { Request, Response, NextFunction } from "express";
// import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

// import session
import session from "express-session";


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

// helmet middleware
myApp.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"], // Only allow content from your domain
    scriptSrc: ["'self'", "'unsafe-inline'"], // Allow scripts only from your domain
    objectSrc: ["'none'"], // Don't allow embedding of objects
    imgSrc: ["'self'", "img.example.com"], // Allow images from your domain and a trusted source
    // Other directives as needed
  },
}));

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


// myApp.use(cookieParser());

// handle static files
myApp.use(express.static("public"));

// json body parser middleware to read the body
myApp.use(express.json());

// a logging middleware
myApp.use(logging);

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set!');
}

// Use express-session
myApp.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // session will expire after 15 minutes of inactivity
  }
}));

// API KEY validation middleware
// myApp.use(simpleAuth);

// view users route middleware
// myApp.use("/generic", genericRouter);

// view users route middleware
myApp.use("/user", userRouter);

// view accounts route middleware
myApp.use("/account", accountRouter);

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
