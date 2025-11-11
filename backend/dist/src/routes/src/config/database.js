"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../../generated/prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['error', 'warn'],
});
exports.default = prisma;
