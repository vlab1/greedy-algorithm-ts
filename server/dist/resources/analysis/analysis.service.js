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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
class AnalysisService {
    greedy_algorithm(input) {
        function getMax(array) {
            let maxElement = {
                value: array[0][0],
                col: 0,
                row: 0,
            };
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                    if (array[i][j] > maxElement.value) {
                        maxElement = { value: array[i][j], col: j, row: i };
                    }
                }
            }
            return maxElement;
        }
        function algorith_end(rowConstraint, colConstraint) {
            let rowEnd = true;
            let colEnd = true;
            for (let i = 0; i < rowConstraint.length; i++) {
                if (rowConstraint[i] !== 0) {
                    rowEnd = false;
                }
            }
            for (let i = 0; i < colConstraint.length; i++) {
                if (colConstraint[i] !== 0) {
                    colEnd = false;
                }
            }
            return rowEnd || colEnd;
        }
        function towerDefenseOutput_init(input) {
            const income = [];
            const columns = [];
            const rows = [];
            const rowConstraint = [];
            const colConstraint = [];
            const efficiency = [];
            for (let i = 0; i < input.income.length; i++) {
                const row = [];
                for (let j = 0; j < input.income[0].length; j++) {
                    row.push(`X${i}${j} (${input.income[i][j]})`);
                }
                income.push(row);
            }
            for (let i = 0; i < input.columns.length; i++) {
                columns.push(input.columns[i]);
            }
            for (let i = 0; i < input.rows.length; i++) {
                rows.push(input.rows[i]);
            }
            for (let i = 0; i < input.rowConstraint.length; i++) {
                rowConstraint.push(input.rowConstraint[i]);
            }
            for (let i = 0; i < input.colConstraint.length; i++) {
                colConstraint.push(input.colConstraint[i]);
            }
            for (let i = 0; i < input.efficiency.length; i++) {
                efficiency.push(input.efficiency[i]);
            }
            const towerDefenseOutput = { income, columns, rows, rowConstraint, colConstraint, efficiency };
            return towerDefenseOutput;
        }
        const output = [];
        output.push(towerDefenseOutput_init(input));
        let i = 0;
        while (!algorith_end(input.rowConstraint, input.colConstraint)) {
            const step = (JSON.parse(JSON.stringify(output[i])));
            i++;
            const max = getMax(input.income);
            const entityHealthPoint = input.colConstraint[max.col];
            const towerHealthPoint = input.rowConstraint[max.row];
            const subtraction = towerHealthPoint - entityHealthPoint;
            if (subtraction > 0) {
                step.income[max.row][max.col] = `${input.colConstraint[max.col]} (${input.income[max.row][max.col]})`;
                input.rowConstraint[max.row] = subtraction;
                input.colConstraint[max.col] = 0;
                step.rowConstraint[max.row] = subtraction;
                step.colConstraint[max.col] = 0;
            }
            else if (subtraction === 0) {
                step.income[max.row][max.col] = `${input.rowConstraint[max.row]} (${input.income[max.row][max.col]})`;
                input.rowConstraint[max.row] = 0;
                input.colConstraint[max.col] = 0;
                step.rowConstraint[max.row] = 0;
                step.colConstraint[max.col] = 0;
            }
            else {
                step.income[max.row][max.col] = `${input.rowConstraint[max.row]} (${input.income[max.row][max.col]})`;
                input.rowConstraint[max.row] = 0;
                input.colConstraint[max.col] = Math.abs(subtraction);
                step.rowConstraint[max.row] = 0;
                step.colConstraint[max.col] = Math.abs(subtraction);
            }
            input.income[max.row][max.col] = -Infinity;
            output.push(step);
        }
        const lastStep = (JSON.parse(JSON.stringify(output[output.length - 1])));
        let bool = false;
        lastStep.income.forEach((array, i) => {
            array.map((item, j) => {
                if (item.indexOf("X") >= 0) {
                    bool = true;
                    const split = item.split(" ");
                    lastStep.income[i][j] = 0 + " " + split[1];
                }
            });
        });
        if (bool) {
            output.push(lastStep);
        }
        return output;
    }
    analysis(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const output = this.greedy_algorithm(input);
                return output;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AnalysisService;
