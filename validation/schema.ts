import joi from "joi";

// define schema for joi validation

// for adding users page

const addUser = {
  firstName: joi
    .string()
    .required()
    .min(1)
    .max(50)
    .pattern(/^[A-Za-z\s'-]+$/)
    .trim()
    .normalize()
    .lowercase()
    .messages({
      "string.empty": "first name is required",
      "string.min": "first name should have a minimum length of 1",
      "string.max": "first name should have a maximum length of 50",
      "string.pattern.base":
        "first name can only contain letters, spaces, hyphens, and apostrophes",
    }),

  lastName: joi
    .string()
    .required()
    .min(1)
    .max(50)
    .pattern(/^[A-Za-z\s'-]+$/)
    .trim()
    .normalize()
    .lowercase()
    .messages({
      "string.empty": "last name is required",
      "string.min": "last name should have a minimum length of 1",
      "string.max": "last name should have a maximum length of 50",
      "string.pattern.base":
        "last name can only contain letters, spaces, hyphens, and apostrophes",
    }),

  number: joi
    .string()
    .pattern(
      /^(((\+44\d{4}|\(?0\d{4}\)?)\d{3}\d{3})|((\+44\d{3}|\(?0\d{3}\)?)\d{3}\d{4})|((\+44\d{2}|\(?0\d{2}\)?)\d{4}\d{4}))/
    )
    .required()
    .messages({
      "string.empty": "phone number is required",
      "string.pattern.base": "phone number must be a valid UK phone number",
    }),

  email: joi
    .string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "string.empty": "email is required",
      "string.email": "email must be a valid email address",
    }),

  dob: joi
    .string()
    .pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    .required()
    .custom((value, helpers) => {
      // split date into array [dd, mm, yyyy]
      const [day, month, year] = value.split("/").map(Number);

      // verify month and day values
      if (month < 1 || month > 12) {
        return helpers.error("date.invalid.month");
      }

      // check if the day is valid for the month, accounting for leap years
      if (day < 1 || day > new Date(year, month, 0).getDate()) {
        return helpers.error("date.invalid.day");
      }

      // check year
      if (year < 1900 || year > new Date().getFullYear()) {
        return helpers.error("date.invalid.year");
      }

      // calculate age
      const currentDate = new Date();
      const birthDate = new Date(value);
      let ageInMillis = currentDate.getTime() - birthDate.getTime();

      const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
      let age = Math.floor(ageInMillis / millisecondsInYear);

      if (age < 18) {
        return helpers.error("any.custom");
      }

      return value;
    })
    .messages({
      "string.empty": "date of birth is required",
      "string.pattern.base": "date of birth must be in the format dd/mm/yyyy",
      "any.custom": "age must be at least 18 years old",
      "date.invalid.day": "date of birth contains an invalid day",
      "date.invalid.month": "date of birth contains an invalid month",
      "date.invalid.year": "date of birth contains an invalid year",
    }),

  password: joi
    .string()
    .required()
    .min(8)
    .max(32)
    .trim()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/)
    .messages({
      "string.empty": "password is required",
      "string.min":
        "password must have a minimum length of {#limit} characters",
      "string.max":
        "password must have a maximum length of {#limit} characters",
      "string.pattern.base":
        "password must contain an uppercase letter, a lowercase letter, and a number",
    }),
};

// for user login
const loginUser = {
  email: joi
    .string()
    .required()
    .email({ tlds: { allow: false } })
    .messages({
      "string.empty": "email is required",
      "string.email": "email must be a valid email address",
    }),

  password: joi.string().min(8).max(32).trim().messages({
    "string.empty": "password is required",
    "string.min": "password must have a minimum length of {#limit} characters",
    "string.max": "password must have a maximum length of {#limit} characters",
  }),
};

// for updating user info

const updateUser = {
  firstName: joi
    .string()
    .min(1)
    .max(50)
    .pattern(/^[A-Za-z\s'-]+$/)
    .trim()
    .normalize()
    .lowercase()
    .messages({
      "string.empty": "first name is required",
      "string.min": "first name should have a minimum length of 1",
      "string.max": "first name should have a maximum length of 50",
      "string.pattern.base":
        "first name can only contain letters, spaces, hyphens, and apostrophes",
    }),

  lastName: joi
    .string()
    .min(1)
    .max(50)
    .pattern(/^[A-Za-z\s'-]+$/)
    .trim()
    .normalize()
    .lowercase()
    .messages({
      "string.empty": "last name is required",
      "string.min": "last name should have a minimum length of 1",
      "string.max": "last name should have a maximum length of 50",
      "string.pattern.base":
        "last name can only contain letters, spaces, hyphens, and apostrophes",
    }),

  number: joi
    .string()
    .pattern(
      /^(((\+44\d{4}|\(?0\d{4}\)?)\d{3}\d{3})|((\+44\d{3}|\(?0\d{3}\)?)\d{3}\d{4})|((\+44\d{2}|\(?0\d{2}\)?)\d{4}\d{4}))/
    )
    .messages({
      "string.empty": "phone number is required",
      "string.pattern.base": "phone number must be a valid UK phone number",
    }),

  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.empty": "email is required",
      "string.email": "email must be a valid email address",
    }),

  dob: joi
    .string()
    .pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    .custom((value, helpers) => {
      // split date into array [dd, mm, yyyy]
      const [day, month, year] = value.split("/").map(Number);

      // verify month and day values
      if (month < 1 || month > 12) {
        return helpers.error("date.invalid.month");
      }

      // check if the day is valid for the month, accounting for leap years
      if (day < 1 || day > new Date(year, month, 0).getDate()) {
        return helpers.error("date.invalid.day");
      }

      // check year
      if (year < 1900 || year > new Date().getFullYear()) {
        return helpers.error("date.invalid.year");
      }

      // calculate age
      const currentDate = new Date();
      const birthDate = new Date(value);
      let ageInMillis = currentDate.getTime() - birthDate.getTime();

      const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
      let age = Math.floor(ageInMillis / millisecondsInYear);

      if (age < 18) {
        return helpers.error("any.custom");
      }

      return value;
    })
    .messages({
      "string.empty": "date of birth is required",
      "string.pattern.base": "date of birth must be in the format dd/mm/yyyy",
      "any.custom": "age must be at least 18 years old",
      "date.invalid.day": "date of birth contains an invalid day",
      "date.invalid.month": "date of birth contains an invalid month",
      "date.invalid.year": "date of birth contains an invalid year",
    }),

  password: joi
    .string()
    .min(8)
    .max(32)
    .trim()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/)
    .messages({
      "string.empty": "password is required",
      "string.min":
        "password must have a minimum length of {#limit} characters",
      "string.max":
        "password must have a maximum length of {#limit} characters",
      "string.pattern.base":
        "password must contain an uppercase letter, a lowercase letter, and a number",
    }),
};

// add account
const addAccount = {
  accountName: joi.string().required().min(1).max(64).trim().messages({
    "string.empty": "Account name is required",
    "string.min": "Account name should have a minimum length of 1",
    "string.max": "Account name should have a maximum length of 64",
  }),

  accountNumber: joi
    .string()
    .pattern(/^\d{8}$/)
    .required()
    .length(8)
    .messages({
      "string.empty": "Bank account number is required",
      "string.pattern.base": "Bank account number must be 8 digits",
    }),

  sortCode: joi
    .string()
    .pattern(/^\d{6}$/)
    .length(6)
    .required()
    .messages({
      "string.empty": "Sort code is required",
      "string.pattern.base": "Sort code must be a valid UK sort code",
    }),

  currencyCode: joi.string().required().length(3).trim().messages({
    "string.empty": "Currency code is required",
    "string.length": "Currency code should be 3 characters",
  }),

  currencyName: joi.string().required().min(1).max(64).trim().messages({
    "string.empty": "Currency name is required",
    "string.min": "Currency name should have a minimum length of 1",
    "string.max": "Currency name should have a maximum length of 64",
  }),

  currencySymbol: joi.string().required().min(1).max(2).trim().messages({
    "string.empty": "Currency symbol is required",
    "string.min": "Currency symbol should have a minimum length of 1",
    "string.max": "Currency symbol should have a maximum length of 2",
  }),

  currencyCountry: joi.string().required().min(1).max(64).trim().messages({
    "string.empty": "Currency country is required",
    "string.min": "Currency country should have a minimum length of 1",
    "string.max": "Currency country should have a maximum length of 64",
  }),

  balance: joi
    .string()
    .required()
    .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
    .messages({
      "string.empty": "Balance is required",
      "string.pattern.base":
        "Balance must be a valid decimal number with up to 2 decimal places",
    }),

  userId: joi.number().integer().required().min(1).messages({
    "number.base": "User ID must be a number",
    "number.empty": "User ID is required",
    "number.min": "User ID should be a positive integer",
  }),
};

// update account
const updateAccount = {
  accountName: joi.string().min(1).max(64).trim().messages({
    "string.empty": "Account name is required",
    "string.min": "Account name should have a minimum length of 1",
    "string.max": "Account name should have a maximum length of 64",
  }),

  accountNumber: joi
    .string()
    .pattern(/^\d{8}$/)
    .length(8)
    .messages({
      "string.empty": "Bank account number is required",
      "string.pattern.base": "Bank account number must be 8 digits",
    }),

  sortCode: joi
    .string()
    .pattern(/^\d{6}$/)
    .length(6)
    .messages({
      "string.empty": "Sort code is required",
      "string.pattern.base": "Sort code must be a valid UK sort code",
    }),

  currencyCode: joi.string().length(3).trim().messages({
    "string.empty": "Currency code is required",
    "string.length": "Currency code should be 3 characters",
  }),

  currencyName: joi.string().min(1).max(64).trim().messages({
    "string.empty": "Currency name is required",
    "string.min": "Currency name should have a minimum length of 1",
    "string.max": "Currency name should have a maximum length of 64",
  }),

  currencySymbol: joi.string().min(1).max(2).trim().messages({
    "string.empty": "Currency symbol is required",
    "string.min": "Currency symbol should have a minimum length of 1",
    "string.max": "Currency symbol should have a maximum length of 2",
  }),

  currencyCountry: joi.string().min(1).max(64).trim().messages({
    "string.empty": "Currency country is required",
    "string.min": "Currency country should have a minimum length of 1",
    "string.max": "Currency country should have a maximum length of 64",
  }),

  balance: joi
    .string()
    .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
    .messages({
      "string.empty": "Balance is required",
      "string.pattern.base":
        "Balance must be a valid decimal number with up to 2 decimal places",
    }),

  userId: joi.number().integer().min(1).messages({
    "number.base": "User ID must be a number",
    "number.empty": "User ID is required",
    "number.min": "User ID should be a positive integer",
  }),
};

// Schema for adding transactions
const addTransaction = {
  type: joi.string().trim().valid('sent', 'received').required().messages({
    "string.empty": "Transaction type is required",
    "any.only": "Transaction type must be either 'sent' or 'received'",
}),

  details: joi.string().required().trim().max(64).messages({
    "string.empty": "Transaction details are required",
    "string.max": "Transaction details cannot be more than 64 characters",
  }),

  amount: joi
    .string()
    .required()
    .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
    .messages({
      "string.empty": "Amount is required",
      "string.pattern.base":
        "Amount must be a valid decimal number with up to 2 decimal places",
    }),

  accountId: joi.number().integer().required().min(1).messages({
    "number.base": "Account ID must be a number",
    "number.empty": "Account ID is required",
    "number.min": "Account ID should be a positive integer",
    "number.integer": "Account ID must be an integer",
  }),
};

// Schema for updating transactions
const updateTransaction = {
  type: joi.string().trim().valid('sent', 'received').messages({
    "string.empty": "Transaction type is required",
    "any.only": "Transaction type must be either 'sent' or 'received'",
}),

  details: joi.string().trim().max(64).messages({
    "string.empty": "Transaction details are required",
    "string.max": "Transaction details cannot be more than 64 characters",
  }),

  amount: joi
    .string()
    .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
    .messages({
      "string.empty": "Amount is required",
      "string.pattern.base":
        "Amount must be a valid decimal number with up to 2 decimal places",
    }),

  accountId: joi.number().integer().min(1).messages({
    "number.base": "Account ID must be a number",
    "number.empty": "Account ID is required",
    "number.min": "Account ID should be a positive integer",
    "number.integer": "Account ID must be an integer",
  }),
};

// for debit card validation

const debit = {
  cardNumber: joi.string().creditCard().required().messages({
    "string.empty": "debit card number is required",
    "string.creditCard": "debit card number must be a valid debit card number",
  }),

  expiryDate: joi
    .string()
    .pattern(/^\d{2}\/\d{2}$/)
    .required()
    .messages({
      "string.empty": "debit card expiry date is required",
      "string.pattern.base":
        "debit card expiry date must be in the format MM/YY",
    }),

  CVV: joi
    .string()
    .pattern(/^\d{3}$/)
    .required()
    .messages({
      "string.empty": "debit card CVV is required",
      "string.pattern.base": "debit card CVV must be a 3-digit number",
    }),
};

export {
  addUser,
  updateUser,
  addAccount,
  updateAccount,
  addTransaction,
  updateTransaction,
  loginUser,
  debit,
};

// FOR LATER USE:

// for login page

// export const login = {
//   email: joi
//     .string()
//     .required()
//     .email({ tlds: { allow: false } })
//     .messages({
//       "string.empty": "email is required",
//       "string.email": "email must be a valid email address",
//     }),

//   password: joi.string().min(8).max(32).trim().messages({
//     "string.empty": "password is required",
//     "string.min": "password must have a minimum length of {#limit} characters",
//     "string.max": "password must have a maximum length of {#limit} characters",
//   }),
// };

// // for payment page

// export const pay = {
//   payeeName: joi
//     .string()
//     .required()
//     .min(1)
//     .max(70)
//     .pattern(/^[A-Za-z\s'-]+$/)
//     .trim()
//     .normalize()
//     .lowercase()
//     .messages({
//       "string.empty": "payee name is required",
//       "string.min": "payee name should have a minimum length of 1",
//       "string.max": "payee n1ame should have a maximum length of 70",
//       "string.pattern.base":
//         "payee name can only contain letters, spaces, hyphens, and apostrophes",
//     }),

//   sortCode: joi
//     .string()
//     .pattern(/^(\d{2}-?)?(\d{2}-?)?\d{2}$/)
//     .required()
//     .min(6)
//     .max(8)
//     .messages({
//       "string.empty": "sort code is required",
//       "string.pattern.base": "sort code must be a valid UK sort code",
//     }),

//   accountNumber: joi
//     .string()
//     .pattern(/^\d{8}$/)
//     .required()
//     .length(8)
//     .messages({
//       "string.empty": "bank account number is required",
//       "string.pattern.base": "bank account number must be 8 digits",
//     }),

//   paymentAmount: joi
//     .string()
//     .required()
//     .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
//     .messages({
//       "string.empty": "amount is required",
//       "string.pattern.base":
//         "amount must be a valid decimal number with up to 2 decimal places",
//     }),
// };



// // for password change

// export const passwordChange = {
//   currentPassword: joi.string().min(8).max(32).trim().messages({
//     "string.empty": "password is required",
//     "string.min": "password must have a minimum length of {#limit} characters",
//     "string.max": "password must have a maximum length of {#limit} characters",
//   }),

//   newPassword: joi
//     .string()
//     .min(8)
//     .max(32)
//     .trim()
//     .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/)
//     .messages({
//       "string.empty": "password is required",
//       "string.min":
//         "password must have a minimum length of {#limit} characters",
//       "string.max":
//         "password must have a maximum length of {#limit} characters",
//       "string.pattern.base":
//         "password must contain an uppercase letter, a lowercase letter, and a number",
//     }),

//   confirmNewPassword: joi.string().valid(joi.ref("newPassword")).messages({
//     "any.only": "passwords do not match",
//     "string.empty": "is not allowed to be empty",
//   }),
// };
