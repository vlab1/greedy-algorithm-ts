"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const analysis = joi_1.default.object({
    columns: joi_1.default.array().items(joi_1.default.string()).required(),
    rows: joi_1.default.array().items(joi_1.default.string()).required(),
    income: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
    rowConstraint: joi_1.default.array().items(joi_1.default.number()).required(),
    colConstraint: joi_1.default.array().items(joi_1.default.number()).required(),
    efficiency: joi_1.default.array().items(joi_1.default.number()).required(),
});
exports.default = {
    analysis
};
