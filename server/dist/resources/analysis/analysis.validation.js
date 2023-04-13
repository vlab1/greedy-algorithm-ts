"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const analysis = joi_1.default.object({
    columns: joi_1.default.array().max(8).min(1).items(joi_1.default.string()).required(),
    columns_N: joi_1.default.array().items(joi_1.default.number()).required(),
    columns_S: joi_1.default.array().items(joi_1.default.number()).required(),
    columns_y: joi_1.default.array().items(joi_1.default.number()).required(),
    rows: joi_1.default.array().max(8).min(1).items(joi_1.default.string()).required(),
    data: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
    rows_H: joi_1.default.array().items(joi_1.default.number()).required(),
    rows_L: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
    rows_z: joi_1.default.array().items(joi_1.default.number()).required(),
});
const delete0 = joi_1.default.object({
    columns: joi_1.default.array().items(joi_1.default.string().valid(null, "", '')).required(),
    rows: joi_1.default.array().items(joi_1.default.string().valid(null, "", '')).required(),
    data: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number().valid(0))).required(),
});
const greedyAlgorithm = joi_1.default.object({
    columns: joi_1.default.array().max(8).min(1).items(joi_1.default.string()).required(),
    columns_N: joi_1.default.array().items(joi_1.default.number()).required(),
    columns_S: joi_1.default.array().items(joi_1.default.number()).required(),
    columns_y: joi_1.default.array().items(joi_1.default.number()).required(),
    rows: joi_1.default.array().max(8).min(1).items(joi_1.default.string()).required(),
    data: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
    rows_H: joi_1.default.array().items(joi_1.default.number()).required(),
    rows_L: joi_1.default.array().items(joi_1.default.array().items(joi_1.default.number())).required(),
    rows_z: joi_1.default.array().items(joi_1.default.number()).required(),
});
exports.default = {
    analysis,
    delete0,
    greedyAlgorithm
};
