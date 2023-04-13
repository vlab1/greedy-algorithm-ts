import DamageModel from '@/resources/damage/damage.model';
import EntityModel from '@/resources/entity/entity.model';
import PointModel from '@/resources/point/point.model';
import {
    Analysis,
    Assignment,
    Point,
    DownloadData,
    MyError,
} from '@/resources/analysis/analysis.interface';
import fs from 'fs';
import myCache from '@/utils/cache/cache';

class AnalysisService {
    private damage = DamageModel;
    private entity = EntityModel;
    private point = PointModel;

    private lookBestOption(dataObj: Analysis): Assignment | Error | MyError {
        try {
            const numRows = dataObj.data.length;
            const numCols = dataObj.data[0].length;
            let maxTotalDamage = 0;
            let bestAssignment: Point[] = [];
            const permute = () => {
                const stack: { i: number; assignment: Point[] }[] = [];
                stack.push({
                    i: 0,
                    assignment: Array(numRows).fill({
                        row: '',
                        column: '',
                        data: 0,
                    }),
                });
                while (stack.length > 0) {
                    const { i, assignment } = stack.pop()!;
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
                            if (
                                dataObj.columns_S[point.row] >
                                dataObj.rows_H[point.column]
                            ) {
                                volumeCondition = false;
                                break;
                            }
                            if (
                                !dataObj.rows_L[point.column].includes(
                                    dataObj.columns_N[point.row]
                                )
                            ) {
                                classCondition = false;
                                break;
                            }
                        }
                        placementCondition =
                            rowSums.every((sum) => sum > 0) &&
                            colSums.every((sum) => sum > 0);

                        if (
                            placementCondition &&
                            volumeCondition &&
                            classCondition &&
                            totalDamage > maxTotalDamage
                        ) {
                            maxTotalDamage = totalDamage;
                            bestAssignment = option;
                        }
                    } else {
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private saveObjectToFile(filePath: string, objectToSave: any): void {
        const jsonString = JSON.stringify(objectToSave);

        fs.writeFile(filePath, jsonString, (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}: `, err);
                return;
            }
            console.log(`Object saved to ${filePath}`);
        });
    }

    private async dbFilling(data: Analysis): Promise<void | Error> {
        try {
            await Promise.all([
                this.entity.destroy({ truncate: true, cascade: true }),
                this.point.destroy({ truncate: true, cascade: true }),
            ]);
            const points_ids: Array<number> = [];
            const entities_ids: Array<number> = [];
            await Promise.all(
                data.rows.map(async (item, index) => {
                    const entity = await this.entity.create({
                        name_A: item,
                        y: data.columns_y[index] === 1,
                        S: data.columns_S[index],
                        N: data.columns_N[index],
                    });
                    entities_ids.push(entity.dataValues.entity_id);
                })
            );
            await Promise.all(
                data.columns.map(async (item, index) => {
                    const point = await this.point.create({
                        name_B: item,
                        z: data.rows_z[index] === 1,
                        H: data.rows_H[index],
                        L: data.rows_L[index],
                    });
                    points_ids.push(point.dataValues.point_id);
                })
            );
            points_ids.sort((a: any, b: any) => a - b);
            entities_ids.sort((a: any, b: any) => a - b);
            const analysis = this.lookBestOption(data);
            if (analysis instanceof Error || 'error' in analysis) {
                const damage = data.data.flatMap((array, point_row) =>
                    array.map((item, entity_column) => ({
                        entity_id: entities_ids[entity_column],
                        point_id: points_ids[point_row],
                        C: item,
                        x: false,
                    }))
                );
                await this.damage.bulkCreate(damage);
            } else {
                const damage = data.data.flatMap((array, point_row) =>
                    array.map((item, entity_column) => ({
                        entity_id: entities_ids[entity_column],
                        point_id: points_ids[point_row],
                        C: item,
                        x:
                            analysis.result.filter(
                                (item) =>
                                    item.column === entity_column &&
                                    item.row === point_row
                            ).length > 0,
                    }))
                );
                await this.damage.bulkCreate(damage);
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async analysis(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>,
        columns_N: Array<number>,
        columns_S: Array<number>,
        columns_y: Array<number>,
        rows_H: Array<number>,
        rows_L: Array<Array<number>>,
        rows_z: Array<number>
    ): Promise<Assignment | Error | MyError> {
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
            if (myCache.has(analysisKey)) {
                return myCache.get(analysisKey);
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
            myCache.set(analysisKey, analysis);
            return analysis;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async save(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>,
        columns_N: Array<number>,
        columns_S: Array<number>,
        columns_y: Array<number>,
        rows_H: Array<number>,
        rows_L: Array<Array<number>>,
        rows_z: Array<number>
    ): Promise<void | Error> {
        try {
            await this.dbFilling({
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete0(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>
    ): Promise<void | Error> {
        try {
            await this.entity.destroy({
                where: {},
                truncate: true,
                cascade: true,
            });
            await this.point.destroy({
                where: {},
                truncate: true,
                cascade: true,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(): Promise<DownloadData | Error> {
        try {
            const pointsData = [] as any;
            const entitiesData = [] as any;
            const damageData = [] as any;

            const points = await this.point.findAll();
            points.map((item) => {
                pointsData.push(item.dataValues);
            });
            const entities = await this.entity.findAll();
            entities.map((item) => {
                entitiesData.push(item.dataValues);
            });
            const damage = await this.damage.findAll();
            damage.map((item) => {
                damageData.push(item.dataValues);
            });

            const damageArray = [] as any;
            for (let i = 0; i < pointsData.length; i++) {
                const array = damageData.filter(
                    (item: any) => item.point_id === pointsData[i].point_id
                );
                damageArray.push(array);
            }
            damageArray.sort((a: any, b: any) => a[0].point_id - b[0].point_id);
            pointsData.sort((a: any, b: any) => a.point_id - b.point_id);
            entitiesData.sort((a: any, b: any) => a.entity_id - b.entity_id);
            for (let i = 0; i < damageArray.length; i++) {
                damageArray[i].sort(
                    (a: any, b: any) => a.entity_id - b.entity_id
                );
            }
            let array1 = [['z'], ['H'], ['L']];
            let result = [] as Array<Array<string>>;
            const assignment = { maxTotalDamage: 0, result: [] } as Assignment;
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
                } else {
                    array.push(entitiesData[i - 1].name_A);
                    for (let m = 0; m < damageArray.length; m++) {
                        array.push(damageArray[i - 1][m].C + '');
                        if (damageArray[i - 1][m].x === true) {
                            assignment.result.push({
                                row: i - 1,
                                column: m,
                                data: Number(damageArray[i - 1][m].C),
                            });
                            assignment.maxTotalDamage += Number(
                                damageArray[i - 1][m].C
                            );
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async greedyAlgorithm(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>,
        columns_N: Array<number>,
        columns_S: Array<number>,
        columns_y: Array<number>,
        rows_H: Array<number>,
        rows_L: Array<Array<number>>,
        rows_z: Array<number>
    ): Promise<Array<Point> | Error> {
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
            function getMax(array: Array<Array<number>>): Point {
                let maxElement = {
                    data: array[0][0],
                    column: 0,
                    row: 0,
                } as Point;
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
            function algorithm_end(array: Array<Array<number>>): boolean {
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
            const output = [] as Array<Point>;
            while (!algorithm_end(dataCopy)) {
                const max = getMax(dataCopy);
                if (
                    input.columns_S[max.row] > input.rows_H[max.column] ||
                    !input.rows_L[max.column].includes(input.columns_N[max.row])
                ) {
                    dataCopy[max.row][max.column] = 0;
                } else {
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default AnalysisService;
