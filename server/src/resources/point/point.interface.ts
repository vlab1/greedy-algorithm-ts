export default interface Point {
    point_id: number;
    name_B: string;
    z?: boolean;
    H: number;
    L: Array<number>;
    createdAt?: Date;
	updatedAt?: Date;
}
