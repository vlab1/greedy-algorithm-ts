"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize = __importStar(require("sequelize-typescript"));
const point_model_1 = __importDefault(require("@/resources/point/point.model"));
const entity_model_1 = __importDefault(require("@/resources/entity/entity.model"));
let DamageModel = class DamageModel extends sequelize.Model {
};
__decorate([
    sequelize.PrimaryKey,
    sequelize.AllowNull(false),
    sequelize.ForeignKey(() => point_model_1.default),
    sequelize.Column(sequelize.DataType.INTEGER)
], DamageModel.prototype, "point_id", void 0);
__decorate([
    sequelize.PrimaryKey,
    sequelize.AllowNull(false),
    sequelize.ForeignKey(() => entity_model_1.default),
    sequelize.Column(sequelize.DataType.INTEGER)
], DamageModel.prototype, "entity_id", void 0);
__decorate([
    sequelize.AllowNull(false),
    sequelize.Column(sequelize.DataType.INTEGER)
], DamageModel.prototype, "C", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.Column(sequelize.DataType.BOOLEAN)
], DamageModel.prototype, "x", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.CreatedAt,
    sequelize.Column(sequelize.DataType.DATE)
], DamageModel.prototype, "createdAt", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.UpdatedAt,
    sequelize.Column(sequelize.DataType.DATE)
], DamageModel.prototype, "updatedAt", void 0);
DamageModel = __decorate([
    sequelize.Table
], DamageModel);
exports.default = DamageModel;
