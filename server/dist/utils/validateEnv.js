"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ['development', 'production'],
        }),
        PGUSER: (0, envalid_1.str)(),
        PGDATABASE: (0, envalid_1.str)(),
        PGPASSWORD: (0, envalid_1.str)(),
        PGPORT: (0, envalid_1.port)({ default: 5432 }),
        PGHOST: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)({ default: 5000 }),
        JWT_SECRET: (0, envalid_1.str)(),
    });
}
exports.default = validateEnv;
