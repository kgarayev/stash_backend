"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash256 = void 0;
var crypto_1 = require("crypto");
// a hashing function in built in Node.js
var hash256 = function (data) {
    // create an instance of crypto
    var hash = crypto_1.default.createHash("sha256");
    //   feed the data in
    hash.update(data);
    //   return the data
    return hash.digest("hex");
};
exports.hash256 = hash256;
