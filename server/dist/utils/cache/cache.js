"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
exports.default = myCache;
