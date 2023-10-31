// function to generate UK account number and sort code

import { asyncPgSQL } from "../database/connection";

// Default initialization values for account number and sort code
const defaultAccountNumber = "20304050";
const defaultSortCode = "102030";

const accountDetails = async () => {
  console.log("hello from account details function");

  // Initialize with default values
  let accountNumber = defaultAccountNumber;
  let sortCode = defaultSortCode;

  try {
    // Use alias in the SQL query for easier access
    const latestNumberResult = await asyncPgSQL(
      `SELECT MAX(account_number) AS max_account_number FROM accounts`,
      []
    );
    const latestCodeResult = await asyncPgSQL(
      `SELECT MAX(sort_code) AS max_sort_code FROM accounts`,
      []
    );

    // Access the values using the alias
    const latestNumber = latestNumberResult[0].max_account_number;
    const latestCode = latestCodeResult[0].max_sort_code;

    console.log(latestNumber);
    console.log(latestCode);

    if (latestNumber && !isNaN(Number(latestNumber))) {
      accountNumber = String(Number(latestNumber) + 1);
    }

    if (latestCode && !isNaN(Number(latestCode))) {
      sortCode = String(Number(latestCode) + 1);
    }
  } catch (e) {
    console.error("Error in accountDetails function:", e);
  }

  console.log(accountNumber, sortCode);

  return { accountNumber, sortCode };
};

export { accountDetails };
