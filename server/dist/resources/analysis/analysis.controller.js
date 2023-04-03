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
const express_1 = require("express");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const validation_middleware_1 = __importDefault(require("@/middleware/validation.middleware"));
const analysis_validation_1 = __importDefault(require("@/resources/analysis/analysis.validation"));
const analysis_service_1 = __importDefault(require("@/resources/analysis/analysis.service"));
class AnalysisController {
    constructor() {
        this.path = '/analysis';
        this.router = (0, express_1.Router)();
        this.AnalysisService = new analysis_service_1.default();
        this.analysis = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { columns, rows, income, rowConstraint, colConstraint, efficiency } = req.body;
                const analysis = yield this.AnalysisService.analysis({
                    columns,
                    rows,
                    income,
                    rowConstraint,
                    colConstraint,
                    efficiency
                });
                res.status(201).json({ data: analysis });
            }
            catch (error) {
                next(new http_exception_1.default(400, error.message));
            }
        });
        this.initialiseRoutes();
    }
    initialiseRoutes() {
        this.router.post(`${this.path}/start`, (0, validation_middleware_1.default)(analysis_validation_1.default.analysis), this.analysis);
    }
}
exports.default = AnalysisController;
