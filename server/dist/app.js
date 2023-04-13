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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = __importDefault(require("@/middleware/error.middleware"));
const helmet_1 = __importDefault(require("helmet"));
const point_model_1 = __importDefault(require("@/resources/point/point.model"));
const entity_model_1 = __importDefault(require("@/resources/entity/entity.model"));
const damage_model_1 = __importDefault(require("@/resources/damage/damage.model"));
const connection_config_1 = require("@/configs/connection.config");
class App {
    constructor(controllers, port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }
    initialiseMiddleware() {
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
    }
    initialiseControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }
    initialiseErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    initialiseDatabaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sequelize = (0, connection_config_1.databaseConnection)(point_model_1.default, entity_model_1.default, damage_model_1.default);
            yield this.sequelize.authenticate();
            yield this.sequelize.sync({ alter: true });
        });
    }
    listen() {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }
    close() {
        this.express.on('close', () => {
            this.sequelize.close();
        });
    }
}
exports.default = App;
