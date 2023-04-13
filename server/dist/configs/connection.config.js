"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const databaseConnection = (...modelSchemas) => {
    try {
        const { PGUSER, PGDATABASE, PGPASSWORD, PGPORT, PGHOST } = process.env;
        const sequelize = new sequelize_typescript_1.Sequelize({
            dialect: "postgres",
            host: PGHOST,
            username: PGUSER,
            password: PGPASSWORD,
            database: PGDATABASE,
            port: Number(PGPORT),
            logging: false,
            models: modelSchemas,
        });
        return sequelize;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.databaseConnection = databaseConnection;
