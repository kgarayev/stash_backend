"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genRandomString = void 0;
var genRandomString = function (len) {
    if (len === void 0) { len = 128; }
    var res = "";
    var charSelection = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
    var charSelectionLen = charSelection.length;
    for (var i = 0; i < len; i++) {
        res += charSelection.charAt(Math.floor(Math.random() * charSelectionLen));
    }
    return res;
};
exports.genRandomString = genRandomString;
