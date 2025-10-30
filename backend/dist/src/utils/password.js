"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
    console.log("the password is :", password);
    console.log("the hash is :", hash);
    console.log("password length:", password.length);
    console.log("hash length:", hash.length);
    console.log("hash starts with $2b$ or $2a$?", hash.startsWith('$2') ? 'Yes' : 'No');
    const result = await bcryptjs_1.default.compare(password, hash);
    console.log("bcrypt.compare result:", result);
    return result;
}
