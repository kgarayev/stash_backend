"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var joi_1 = require("joi");
var schema_1 = require("./schema");
var validate = function (payload, type) { return __awaiter(void 0, void 0, void 0, function () {
    var option, results, errors_1, errorsModified_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                option = joi_1.default.object({});
                switch (type) {
                    case "addUser":
                        // call joi
                        option = joi_1.default.object(schema_1.addUser);
                        break;
                    case "loginUser":
                        // call joi
                        option = joi_1.default.object(schema_1.loginUser);
                        break;
                    case "updateUser":
                        // call joi
                        option = joi_1.default.object(schema_1.updateUser);
                        break;
                    case "addAccount":
                        // call joi
                        option = joi_1.default.object(schema_1.addAccount);
                        break;
                    case "updateAccount":
                        // call joi
                        option = joi_1.default.object(schema_1.updateAccount);
                        break;
                    case "addTransaction":
                        // call joi
                        option = joi_1.default.object(schema_1.addTransaction);
                        break;
                    case "updateTransaction":
                        // call joi
                        option = joi_1.default.object(schema_1.updateTransaction);
                        break;
                    case "debit":
                        // call joi
                        option = joi_1.default.object(schema_1.debit);
                        break;
                    case "pay":
                        // call joi
                        option = joi_1.default.object(schema_1.pay);
                        break;
                    default:
                        break;
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, option.validateAsync(payload, { abortEarly: false })];
            case 2:
                results = _a.sent();
                return [2 /*return*/, null];
            case 3:
                errors_1 = _a.sent();
                errorsModified_1 = {};
                errors_1.details.forEach(function (error) {
                    var _a;
                    var key = (_a = error.context) === null || _a === void 0 ? void 0 : _a.key;
                    if (key) {
                        errorsModified_1[key] = error.message;
                    }
                });
                return [2 /*return*/, errorsModified_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.validate = validate;
