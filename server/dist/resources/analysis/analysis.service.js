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
const damage_model_1 = __importDefault(require("@/resources/damage/damage.model"));
const entity_model_1 = __importDefault(require("@/resources/entity/entity.model"));
const point_model_1 = __importDefault(require("@/resources/point/point.model"));
const fs_1 = __importDefault(require("fs"));
const cache_1 = __importDefault(require("@/utils/cache/cache"));
class AnalysisService {
    constructor() {
        this.damage = damage_model_1.default;
        this.entity = entity_model_1.default;
        this.point = point_model_1.default;
    }
    lookBestOption(dataObj) {
        try {
            const numRows = dataObj.data.length;
            const numCols = dataObj.data[0].length;
            let maxTotalDamage = 0;
            let bestAssignment = [];
            const permute = () => {
                const stack = [];
                stack.push({
                    i: 0,
                    assignment: Array(numRows).fill({
                        row: '',
                        column: '',
                        data: 0,
                    }),
                });
                while (stack.length > 0) {
                    const { i, assignment } = stack.pop();
                    if (i === numRows) {
                        const option = [...assignment];
                        const rowSums = Array(numRows).fill(0);
                        const colSums = Array(numCols).fill(0);
                        let totalDamage = 0;
                        let volumeCondition = true;
                        let classCondition = true;
                        let placementCondition = false;
                        for (const point of option) {
                            const { row, column, data } = point;
                            rowSums[row] += data;
                            colSums[column] -= -data;
                            totalDamage += data;
                        }
                        for (let j = 0; j < option.length; j++) {
                            const point = option[j];
                            if (dataObj.columns_S[point.row] >
                                dataObj.rows_H[point.column]) {
                                volumeCondition = false;
                                break;
                            }
                            if (!dataObj.rows_L[point.column].includes(dataObj.columns_N[point.row])) {
                                classCondition = false;
                                break;
                            }
                        }
                        placementCondition =
                            rowSums.every((sum) => sum > 0) &&
                                colSums.every((sum) => sum > 0);
                        if (placementCondition &&
                            volumeCondition &&
                            classCondition &&
                            totalDamage > maxTotalDamage) {
                            maxTotalDamage = totalDamage;
                            bestAssignment = option;
                        }
                    }
                    else {
                        for (let j = 0; j < numCols; j++) {
                            assignment[i] = {
                                row: i,
                                column: j,
                                data: dataObj.data[i][j],
                            };
                            stack.push({
                                i: i + 1,
                                assignment: [...assignment],
                            });
                        }
                    }
                }
            };
            permute();
            if (maxTotalDamage === 0 && bestAssignment.length === 0) {
                return { error: true };
            }
            return { maxTotalDamage, result: bestAssignment };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    saveObjectToFile(filePath, objectToSave) {
        const jsonString = JSON.stringify(objectToSave);
        fs_1.default.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}: `, err);
                return;
            }
            console.log(`Object saved to ${filePath}`);
        });
    }
    dbFilling(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    this.entity.destroy({ truncate: true, cascade: true }),
                    this.point.destroy({ truncate: true, cascade: true }),
                ]);
                const points_ids = [];
                const entities_ids = [];
                yield Promise.all(data.rows.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    const entity = yield this.entity.create({
                        name_A: item,
                        y: data.columns_y[index] === 1,
                        S: data.columns_S[index],
                        N: data.columns_N[index],
                    });
                    entities_ids.push(entity.dataValues.entity_id);
                })));
                yield Promise.all(data.columns.map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    const point = yield this.point.create({
                        name_B: item,
                        z: data.rows_z[index] === 1,
                        H: data.rows_H[index],
                        L: data.rows_L[index],
                    });
                    points_ids.push(point.dataValues.point_id);
                })));
                points_ids.sort((a, b) => a - b);
                entities_ids.sort((a, b) => a - b);
                const analysis = this.lookBestOption(data);
                if (analysis instanceof Error || 'error' in analysis) {
                    const damage = data.data.flatMap((array, entity_column) => array.map((item, point_row) => ({
                        entity_id: entities_ids[entity_column],
                        point_id: points_ids[point_row],
                        C: item,
                        x: false,
                    })));
                    yield this.damage.bulkCreate(damage);
                }
                else {
                    const damage = data.data.flatMap((array, entity_column) => array.map((item, point_row) => ({
                        entity_id: entities_ids[entity_column],
                        point_id: points_ids[point_row],
                        C: item,
                        x: analysis.result.filter((item) => item.column === entity_column &&
                            item.row === point_row).length > 0,
                    })));
                    yield this.damage.bulkCreate(damage);
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    analysis(columns, rows, data, columns_N, columns_S, columns_y, rows_H, rows_L, rows_z) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analysisKey = JSON.stringify({
                    columns,
                    rows,
                    data,
                    columns_N,
                    columns_S,
                    columns_y,
                    rows_H,
                    rows_L,
                    rows_z,
                });
                if (cache_1.default.has(analysisKey)) {
                    return cache_1.default.get(analysisKey);
                }
                const analysis = this.lookBestOption({
                    columns,
                    rows,
                    data,
                    columns_N,
                    columns_S,
                    columns_y,
                    rows_H,
                    rows_L,
                    rows_z,
                });
                cache_1.default.set(analysisKey, analysis);
                return analysis;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    save(columns, rows, data, columns_N, columns_S, columns_y, rows_H, rows_L, rows_z) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbFilling({
                    columns,
                    rows,
                    data,
                    columns_N,
                    columns_S,
                    columns_y,
                    rows_H,
                    rows_L,
                    rows_z,
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete0(columns, rows, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.entity.destroy({
                    where: {},
                    truncate: true,
                    cascade: true,
                });
                yield this.point.destroy({
                    where: {},
                    truncate: true,
                    cascade: true,
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pointsData = [];
                const entitiesData = [];
                const damageData = [];
                const points = yield this.point.findAll();
                points.map((item) => {
                    pointsData.push(item.dataValues);
                });
                const entities = yield this.entity.findAll();
                entities.map((item) => {
                    entitiesData.push(item.dataValues);
                });
                const damage = yield this.damage.findAll();
                damage.map((item) => {
                    damageData.push(item.dataValues);
                });
                const damageArray = [];
                for (let i = 0; i < pointsData.length; i++) {
                    const array = damageData.filter((item) => item.point_id === pointsData[i].point_id);
                    damageArray.push(array);
                }
                damageArray.sort((a, b) => a[0].point_id - b[0].point_id);
                pointsData.sort((a, b) => a.point_id - b.point_id);
                entitiesData.sort((a, b) => a.entity_id - b.entity_id);
                for (let i = 0; i < damageArray.length; i++) {
                    damageArray[i].sort((a, b) => a.entity_id - b.entity_id);
                }
                let array1 = [['z'], ['H'], ['L']];
                let result = [];
                const assignment = { maxTotalDamage: 0, result: [] };
                for (let i = 0; i < entitiesData.length + 1; i++) {
                    let array = [];
                    if (i === 0) {
                        array.push('');
                        for (let k = 0; k < pointsData.length; k++) {
                            array.push(pointsData[k].name_B);
                            array1[0].push(pointsData[k].z === true ? '1' : '0');
                            array1[1].push(pointsData[k].H + '');
                            array1[2].push('[' + pointsData[k].L.join(', ') + ']');
                        }
                        array.push('y');
                        array.push('S');
                        array.push('N');
                        result.push(array);
                    }
                    else {
                        array.push(entitiesData[i - 1].name_A);
                        for (let m = 0; m < damageArray.length; m++) {
                            array.push(damageArray[m][i - 1].C + '');
                            if (damageArray[m][i - 1].x === true) {
                                assignment.result.push({
                                    row: m,
                                    column: i - 1,
                                    data: Number(damageArray[m][i - 1].C),
                                });
                                assignment.maxTotalDamage += Number(damageArray[m][i - 1].C);
                            }
                        }
                        array.push(entitiesData[i - 1].y === true ? '1' : '0');
                        array.push(entitiesData[i - 1].S + '');
                        array.push(entitiesData[i - 1].N + '');
                        result.push(array);
                    }
                }
                for (let i = 0; i < array1.length; i++) {
                    result.push(array1[i]);
                }
                return { assignment, data: result };
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    greedyAlgorithm(columns, rows, data, columns_N, columns_S, columns_y, rows_H, rows_L, rows_z) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    columns,
                    rows,
                    data,
                    columns_N,
                    columns_S,
                    columns_y,
                    rows_H,
                    rows_L,
                    rows_z,
                };
                function getMax(array) {
                    let maxElement = {
                        data: array[0][0],
                        column: 0,
                        row: 0,
                    };
                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < array[i].length; j++) {
                            if (array[i][j] > maxElement.data) {
                                maxElement = {
                                    data: array[i][j],
                                    column: j,
                                    row: i,
                                };
                            }
                        }
                    }
                    return maxElement;
                }
                function algorithm_end(array) {
                    let zeros = 0;
                    for (let i = 0; i < array.length; i++) {
                        for (let j = 0; j < array[0].length; j++) {
                            if (array[i][j] === 0) {
                                zeros += 1;
                            }
                        }
                    }
                    return zeros === array.length * array[0].length;
                }
                const dataCopy = JSON.parse(JSON.stringify(input.data));
                const output = [];
                while (!algorithm_end(dataCopy)) {
                    const max = getMax(dataCopy);
                    if (input.columns_S[max.row] > input.rows_H[max.column] ||
                        !input.rows_L[max.column].includes(input.columns_N[max.row])) {
                        dataCopy[max.row][max.column] = 0;
                    }
                    else {
                        output.push({
                            row: max.row,
                            column: max.column,
                            data: max.data,
                        });
                        for (let i = 0; i < dataCopy[max.row].length; i++) {
                            dataCopy[max.row][i] = 0;
                        }
                        for (let i = 0; i < dataCopy.length; i++) {
                            dataCopy[i][max.column] = 0;
                        }
                    }
                }
                return output;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AnalysisService;
