// function to generate UK account number and sort code

// import asyncMySQL function
import { number } from "joi";
import { asyncPgSQL } from "../database/connection";

// import queries
import { queries } from "../database/queries";

const accountDetails = async () => {
  console.log("hello from account details function");

  let accountNumber = "";
  let sortCode = "";

  try {
    const latestNumber = await asyncPgSQL(
      `SELECT MAX(account_number) FROM accounts`,
      []
    );
    const latestCode = await asyncPgSQL(
      `SELECT MAX(sort_code) FROM accounts`,
      []
    );

    console.log(latestNumber[0]["MAX(account_number)"]);
    console.log(latestCode[0]);

    if (
      latestNumber &&
      !isNaN(Number(latestNumber[0]["MAX(account_number)"]))
    ) {
      accountNumber = String(
        Number(latestNumber[0]["MAX(account_number)"]) + 1
      );
    } else {
      accountNumber = "20304050";
    }

    if (latestCode && !isNaN(Number(latestCode[0]["MAX(sort_code)"]))) {
      sortCode = String(Number(latestCode[0]["MAX(sort_code)"]) + 1);
    } else {
      sortCode = "102030";
    }
  } catch (e) {
    console.log(e);
  }

  console.log(accountNumber, sortCode);

  return { accountNumber, sortCode };
};

export { accountDetails };
