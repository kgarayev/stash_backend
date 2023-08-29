"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pay = exports.debit = exports.loginUser = exports.updateTransaction = exports.addTransaction = exports.updateAccount = exports.addAccount = exports.updateUser = exports.addUser = void 0;
var joi_1 = require("joi");
// define schema for joi validation
// for adding users page
var addUser = {
    firstName: joi_1.default
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
        "string.pattern.base": "first name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    lastName: joi_1.default
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
        "string.pattern.base": "last name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    number: joi_1.default
        .string()
        .pattern(/^(((\+44\d{4}|\(?0\d{4}\)?)\d{3}\d{3})|((\+44\d{3}|\(?0\d{3}\)?)\d{3}\d{4})|((\+44\d{2}|\(?0\d{2}\)?)\d{4}\d{4}))/)
        .required()
        .messages({
        "string.empty": "phone number is required",
        "string.pattern.base": "phone number must be a valid UK phone number",
    }),
    email: joi_1.default
        .string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
        "string.empty": "email is required",
        "string.email": "email must be a valid email address",
    }),
    dob: joi_1.default
        .string()
        .pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        .required()
        .custom(function (value, helpers) {
        // split date into array [dd, mm, yyyy]
        var _a = value.split("/").map(Number), day = _a[0], month = _a[1], year = _a[2];
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
        var currentDate = new Date();
        var birthDate = new Date(value);
        var ageInMillis = currentDate.getTime() - birthDate.getTime();
        var millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
        var age = Math.floor(ageInMillis / millisecondsInYear);
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
    password: joi_1.default
        .string()
        .required()
        .min(8)
        .max(32)
        .trim()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/)
        .messages({
        "string.empty": "password is required",
        "string.min": "password must have a minimum length of {#limit} characters",
        "string.max": "password must have a maximum length of {#limit} characters",
        "string.pattern.base": "password must contain an uppercase letter, a lowercase letter, and a number",
    }),
};
exports.addUser = addUser;
// for user login
var loginUser = {
    email: joi_1.default
        .string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
        "string.empty": "email is required",
        "string.email": "email must be a valid email address",
    }),
    password: joi_1.default.string().min(8).max(32).trim().messages({
        "string.empty": "password is required",
        "string.min": "password must have a minimum length of {#limit} characters",
        "string.max": "password must have a maximum length of {#limit} characters",
    }),
};
exports.loginUser = loginUser;
// for updating user info
var updateUser = {
    firstName: joi_1.default
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
        "string.pattern.base": "first name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    lastName: joi_1.default
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
        "string.pattern.base": "last name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    number: joi_1.default
        .string()
        .pattern(/^(((\+44\d{4}|\(?0\d{4}\)?)\d{3}\d{3})|((\+44\d{3}|\(?0\d{3}\)?)\d{3}\d{4})|((\+44\d{2}|\(?0\d{2}\)?)\d{4}\d{4}))/)
        .messages({
        "string.empty": "phone number is required",
        "string.pattern.base": "phone number must be a valid UK phone number",
    }),
    email: joi_1.default
        .string()
        .email({ tlds: { allow: false } })
        .messages({
        "string.empty": "email is required",
        "string.email": "email must be a valid email address",
    }),
    dob: joi_1.default
        .string()
        .pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        .custom(function (value, helpers) {
        // split date into array [dd, mm, yyyy]
        var _a = value.split("/").map(Number), day = _a[0], month = _a[1], year = _a[2];
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
        var currentDate = new Date();
        var birthDate = new Date(value);
        var ageInMillis = currentDate.getTime() - birthDate.getTime();
        var millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
        var age = Math.floor(ageInMillis / millisecondsInYear);
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
    password: joi_1.default
        .string()
        .min(8)
        .max(32)
        .trim()
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*/)
        .messages({
        "string.empty": "password is required",
        "string.min": "password must have a minimum length of {#limit} characters",
        "string.max": "password must have a maximum length of {#limit} characters",
        "string.pattern.base": "password must contain an uppercase letter, a lowercase letter, and a number",
    }),
};
exports.updateUser = updateUser;
// add account
var addAccount = {
    accountName: joi_1.default.string().required().min(1).max(64).trim().messages({
        "string.empty": "Account name is required",
        "string.min": "Account name should have a minimum length of 1",
        "string.max": "Account name should have a maximum length of 64",
    }),
    accountNumber: joi_1.default
        .string()
        .pattern(/^\d{8}$/)
        .required()
        .length(8)
        .messages({
        "string.empty": "Bank account number is required",
        "string.pattern.base": "Bank account number must be 8 digits",
    }),
    sortCode: joi_1.default
        .string()
        .pattern(/^\d{6}$/)
        .length(6)
        .required()
        .messages({
        "string.empty": "Sort code is required",
        "string.pattern.base": "Sort code must be a valid UK sort code",
    }),
    currencyCode: joi_1.default.string().required().length(3).trim().messages({
        "string.empty": "Currency code is required",
        "string.length": "Currency code should be 3 characters",
    }),
    currencyName: joi_1.default.string().required().min(1).max(64).trim().messages({
        "string.empty": "Currency name is required",
        "string.min": "Currency name should have a minimum length of 1",
        "string.max": "Currency name should have a maximum length of 64",
    }),
    currencySymbol: joi_1.default.string().required().min(1).max(2).trim().messages({
        "string.empty": "Currency symbol is required",
        "string.min": "Currency symbol should have a minimum length of 1",
        "string.max": "Currency symbol should have a maximum length of 2",
    }),
    currencyCountry: joi_1.default.string().required().min(1).max(64).trim().messages({
        "string.empty": "Currency country is required",
        "string.min": "Currency country should have a minimum length of 1",
        "string.max": "Currency country should have a maximum length of 64",
    }),
    balance: joi_1.default
        .string()
        .required()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "Balance is required",
        "string.pattern.base": "Balance must be a valid decimal number with up to 2 decimal places",
    }),
    userId: joi_1.default.number().integer().required().min(1).messages({
        "number.base": "User ID must be a number",
        "number.empty": "User ID is required",
        "number.min": "User ID should be a positive integer",
    }),
};
exports.addAccount = addAccount;
// update account
var updateAccount = {
    accountName: joi_1.default.string().min(1).max(64).trim().messages({
        "string.empty": "Account name is required",
        "string.min": "Account name should have a minimum length of 1",
        "string.max": "Account name should have a maximum length of 64",
    }),
    accountNumber: joi_1.default
        .string()
        .pattern(/^\d{8}$/)
        .length(8)
        .messages({
        "string.empty": "Bank account number is required",
        "string.pattern.base": "Bank account number must be 8 digits",
    }),
    sortCode: joi_1.default
        .string()
        .pattern(/^\d{6}$/)
        .length(6)
        .messages({
        "string.empty": "Sort code is required",
        "string.pattern.base": "Sort code must be a valid UK sort code",
    }),
    currencyCode: joi_1.default.string().length(3).trim().messages({
        "string.empty": "Currency code is required",
        "string.length": "Currency code should be 3 characters",
    }),
    currencyName: joi_1.default.string().min(1).max(64).trim().messages({
        "string.empty": "Currency name is required",
        "string.min": "Currency name should have a minimum length of 1",
        "string.max": "Currency name should have a maximum length of 64",
    }),
    currencySymbol: joi_1.default.string().min(1).max(2).trim().messages({
        "string.empty": "Currency symbol is required",
        "string.min": "Currency symbol should have a minimum length of 1",
        "string.max": "Currency symbol should have a maximum length of 2",
    }),
    currencyCountry: joi_1.default.string().min(1).max(64).trim().messages({
        "string.empty": "Currency country is required",
        "string.min": "Currency country should have a minimum length of 1",
        "string.max": "Currency country should have a maximum length of 64",
    }),
    balance: joi_1.default
        .string()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "Balance is required",
        "string.pattern.base": "Balance must be a valid decimal number with up to 2 decimal places",
    }),
    userId: joi_1.default.number().integer().min(1).messages({
        "number.base": "User ID must be a number",
        "number.empty": "User ID is required",
        "number.min": "User ID should be a positive integer",
    }),
};
exports.updateAccount = updateAccount;
// Schema for adding transactions
var addTransaction = {
    type: joi_1.default.string().trim().valid("sent", "received").required().messages({
        "string.empty": "Transaction type is required",
        "any.only": "Transaction type must be either 'sent' or 'received'",
    }),
    details: joi_1.default.string().required().trim().max(64).messages({
        "string.empty": "Transaction details are required",
        "string.max": "Transaction details cannot be more than 64 characters",
    }),
    amount: joi_1.default
        .string()
        .required()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "Amount is required",
        "string.pattern.base": "Amount must be a valid decimal number with up to 2 decimal places",
    }),
    accountId: joi_1.default.number().integer().required().min(1).messages({
        "number.base": "Account ID must be a number",
        "number.empty": "Account ID is required",
        "number.min": "Account ID should be a positive integer",
        "number.integer": "Account ID must be an integer",
    }),
};
exports.addTransaction = addTransaction;
// Schema for updating transactions
var updateTransaction = {
    type: joi_1.default.string().trim().valid("sent", "received").messages({
        "string.empty": "Transaction type is required",
        "any.only": "Transaction type must be either 'sent' or 'received'",
    }),
    details: joi_1.default.string().trim().max(64).messages({
        "string.empty": "Transaction details are required",
        "string.max": "Transaction details cannot be more than 64 characters",
    }),
    amount: joi_1.default
        .string()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "Amount is required",
        "string.pattern.base": "Amount must be a valid decimal number with up to 2 decimal places",
    }),
    accountId: joi_1.default.number().integer().min(1).messages({
        "number.base": "Account ID must be a number",
        "number.empty": "Account ID is required",
        "number.min": "Account ID should be a positive integer",
        "number.integer": "Account ID must be an integer",
    }),
};
exports.updateTransaction = updateTransaction;
// for debit card validation
var debit = {
    amount: joi_1.default
        .string()
        .required()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "amount is required",
        "string.pattern.base": "amount must be a valid decimal number with up to 2 decimal places",
    }),
    cardNumber: joi_1.default.string().creditCard().required().messages({
        "string.empty": "debit card number is required",
        "string.creditCard": "debit card number must be a valid debit card number",
    }),
    expiryDate: joi_1.default
        .string()
        .pattern(/^\d{2}\/\d{2}$/)
        .required()
        .messages({
        "string.empty": "debit card expiry date is required",
        "string.pattern.base": "debit card expiry date must be in the format MM/YY",
    }),
    CVV: joi_1.default
        .string()
        .pattern(/^\d{3}$/)
        .required()
        .messages({
        "string.empty": "debit card CVV is required",
        "string.pattern.base": "debit card CVV must be a 3-digit number",
    }),
};
exports.debit = debit;
// to validate payment details
var pay = {
    payeeName: joi_1.default
        .string()
        .required()
        .min(1)
        .max(70)
        .pattern(/^[A-Za-z\s'-]+$/)
        .trim()
        .normalize()
        .lowercase()
        .messages({
        "string.empty": "payee name is required",
        "string.min": "payee name should have a minimum length of 1",
        "string.max": "payee n1ame should have a maximum length of 70",
        "string.pattern.base": "payee name can only contain letters, spaces, hyphens, and apostrophes",
    }),
    sortCode: joi_1.default
        .string()
        .pattern(/^(\d{2}-?)?(\d{2}-?)?\d{2}$/)
        .required()
        .min(6)
        .max(8)
        .messages({
        "string.empty": "sort code is required",
        "string.pattern.base": "sort code must be a valid UK sort code",
    }),
    accountNumber: joi_1.default
        .string()
        .pattern(/^\d{8}$/)
        .required()
        .length(8)
        .messages({
        "string.empty": "bank account number is required",
        "string.pattern.base": "bank account number must be 8 digits",
    }),
    amount: joi_1.default
        .string()
        .required()
        .pattern(/^\d+(\.\d{1,2})?$/) // Allows positive decimal numbers with up to 2 decimal places
        .messages({
        "string.empty": "amount is required",
        "string.pattern.base": "amount must be a valid decimal number with up to 2 decimal places",
    }),
};
exports.pay = pay;
// FOR LATER USE:
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
