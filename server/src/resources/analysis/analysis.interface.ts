 interface Analysis {
    columns: Array<string>;
    rows: Array<string>;
    data: Array<Array<number>>;
    columns_N: Array<number>;
    columns_S: Array<number>;
    columns_y: Array<number>;
    rows_H: Array<number>;
    rows_L: Array<Array<number>>;
    rows_z: Array<number>;
}

interface AnalysisOutput {
    columns: Array<string>;
    rows: Array<string>;
    data: Array<Array<string>>;
    columns_N: Array<number>;
    columns_S: Array<number>;
    columns_y: Array<number>;
    rows_H: Array<number>;
    rows_L: Array<Array<number>>;
    rows_z: Array<number>;
}

interface ArrayElement {
    value: number;
    row: number;
    col: number;
}

interface Point {
    row: number;
    column: number;
    data: number;
}

interface MyError {
    error: boolean;
}

interface Assignment {
    maxTotalDamage: number;
    result: Point[];
}

interface DownloadData {
    assignment: Assignment,
    data: Array<Array<string>>
}

export {Analysis, Point, Assignment, DownloadData, MyError, AnalysisOutput, ArrayElement}