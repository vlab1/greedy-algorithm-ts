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
const damage_model_1 = __importDefault(require("@/resources/damage/damage.model"));
let PointModel = class PointModel extends sequelize.Model {
};
__decorate([
    sequelize.PrimaryKey,
    sequelize.AutoIncrement,
    sequelize.AllowNull(false),
    sequelize.Column(sequelize.DataType.INTEGER)
], PointModel.prototype, "point_id", void 0);
__decorate([
    sequelize.AllowNull(false),
    sequelize.Unique,
    sequelize.Column(sequelize.DataType.STRING)
], PointModel.prototype, "name_B", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.Column(sequelize.DataType.BOOLEAN)
], PointModel.prototype, "z", void 0);
__decorate([
    sequelize.AllowNull(false),
    sequelize.Column(sequelize.DataType.INTEGER)
], PointModel.prototype, "H", void 0);
__decorate([
    sequelize.AllowNull(false),
    sequelize.Column(sequelize.DataType.ARRAY(sequelize.DataType.INTEGER))
], PointModel.prototype, "L", void 0);
__decorate([
    sequelize.HasMany(() => damage_model_1.default, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        hooks: true
    })
], PointModel.prototype, "damages", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.CreatedAt,
    sequelize.Column(sequelize.DataType.DATE)
], PointModel.prototype, "createdAt", void 0);
__decorate([
    sequelize.AllowNull,
    sequelize.UpdatedAt,
    sequelize.Column(sequelize.DataType.DATE)
], PointModel.prototype, "updatedAt", void 0);
PointModel = __decorate([
    sequelize.Table
], PointModel);
exports.default = PointModel;
