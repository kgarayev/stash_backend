import joi, { ObjectSchema, ValidationError, ValidationErrorItem } from "joi";

import {
  addUser,
  updateUser,
  addAccount,
  updateAccount,
  addTransaction,
  updateTransaction,
  loginUser,
} from "./schema";

// main joi validation functions

interface Payload {
  firstName?: string;
  lastName?: string;
  number?: string;
  email?: string;
  dob?: string;
  password?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  currencyCode?: string;
  currencyName?: string;
  currencySymbol?: string;
  currencyCountry?: string;
  balance?: string;
  userId?: number;
  type?: string;
  details?: string;
  amount?: string;
  accountId?: number;
}

const validate = async (payload: Payload, type: string) => {
  let option: ObjectSchema = joi.object({}); // Assign a default value;

  switch (type) {
    case "addUser":
      // call joi
      option = joi.object(addUser);
      break;

    case "loginUser":
      // call joi
      option = joi.object(loginUser);
      break;

    case "updateUser":
      // call joi
      option = joi.object(updateUser);
      break;

    case "addAccount":
      // call joi
      option = joi.object(addAccount);
      break;

    case "updateAccount":
      // call joi
      option = joi.object(updateAccount);
      break;

    case "addTransaction":
      // call joi
      option = joi.object(addTransaction);
      break;

    case "updateTransaction":
      // call joi
      option = joi.object(updateTransaction);
      break;

    default:
      break;
  }

  try {
    const results = await option.validateAsync(payload, { abortEarly: false });
    return null;
  } catch (errors) {
    const errorsModified: any = {};
    (errors as any).details.forEach((error: ValidationErrorItem) => {
      const key = error.context?.key;
      if (key) {
        errorsModified[key] = error.message;
      }
    });

    return errorsModified;
  }
};

export { validate };
