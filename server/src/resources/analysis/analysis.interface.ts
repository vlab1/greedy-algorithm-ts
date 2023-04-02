interface TowerDefenceInput {
    columns: Array<string>;
    rows: Array<string>;
    income: Array<Array<number>>;
    rowConstraint: Array<number>;
    colConstraint: Array<number>;
    efficiency: Array<number>;
}

interface TowerDefenseOutput {
    columns: Array<string>;
    rows: Array<string>;
    income: Array<Array<string>>;
    rowConstraint: Array<number>;
    colConstraint: Array<number>;
    efficiency: Array<number>;
}
[];

interface ArrayElement {
    value: number;
    row: number;
    col: number;
}

export { TowerDefenceInput, TowerDefenseOutput, ArrayElement };
