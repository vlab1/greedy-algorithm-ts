import {
    TowerDefenceInput,
    TowerDefenseOutput,
    ArrayElement,
} from '@/resources/analysis/analysis.interface';
var fs = require('fs');
class AnalysisService {
    private greedy_algorithm(input: TowerDefenceInput): Array<TowerDefenseOutput> {
        function getMax(array: Array<Array<number>>): ArrayElement {
            let maxElement = {
                value: array[0][0],
                col: 0,
                row: 0,
            } as ArrayElement;
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                    if (array[i][j] > maxElement.value) {
                        maxElement = { value: array[i][j], col: j, row: i };
                    }
                }
            }
            return maxElement;
        }
        function algorith_end(
            rowConstraint: Array<Number>,
            colConstraint: Array<Number>
        ): boolean {
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
        function towerDefenseOutput_init(
            input: TowerDefenceInput
        ): TowerDefenseOutput {
            const income = [] as Array<Array<string>>;
            const columns = [] as Array<string>;
            const rows = [] as Array<string>;
            const rowConstraint = [] as Array<number>;
            const colConstraint = [] as Array<number>;
            const efficiency = [] as Array<number>;
            for (let i = 0; i < input.income.length; i++) {
                const row = [] as Array<string>;
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
            const towerDefenseOutput = {income, columns, rows, rowConstraint, colConstraint, efficiency} as TowerDefenseOutput; 
            return towerDefenseOutput;  
        }
        const output = [] as Array<TowerDefenseOutput>;
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
            } else if (subtraction === 0) {
                step.income[max.row][max.col] = `${input.rowConstraint[max.row]} (${input.income[max.row][max.col]})`;
                input.rowConstraint[max.row] = 0;
                input.colConstraint[max.col] = 0;
                step.rowConstraint[max.row] = 0;
                step.colConstraint[max.col] = 0;
            } else {
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
        lastStep.income.forEach((array: Array<string>, i: number) => {
            array.map((item: string, j: number) => {
                if (item.indexOf("X") >= 0) {
                    bool = true;
                    const split = item.split(" ");     
                    lastStep.income[i][j] = 0 + " " + split[1];
                }
            })
        })
        if (bool) {
            output.push(lastStep);
        }
        return output;
    }

    public async analysis(
        input: TowerDefenceInput
    ): Promise<Array<TowerDefenseOutput> | Error> {
        try {
            const output = this.greedy_algorithm(input);
            return output;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default AnalysisService;
