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

    // Type checking and making sure the 'rows' property exists and has at least one element
    if (latestNumberResult.rows && latestNumberResult.rows.length > 0) {
      const latestNumber = latestNumberResult.rows[0].max_account_number;

      if (latestNumber && !isNaN(Number(latestNumber))) {
        accountNumber = String(Number(latestNumber) + 1);
      }
    }

    if (latestCodeResult.rows && latestCodeResult.rows.length > 0) {
      const latestCode = latestCodeResult.rows[0].max_sort_code;

      if (latestCode && !isNaN(Number(latestCode))) {
        sortCode = String(Number(latestCode) + 1);
      }
    }
  } catch (e) {
    console.error("Error in accountDetails function:", e);
  }

  console.log(accountNumber, sortCode);

  return { accountNumber, sortCode };
};

export { accountDetails };
