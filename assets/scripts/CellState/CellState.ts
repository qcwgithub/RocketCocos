import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellStateType } from "./CellStateType";

export abstract class CellState {
    public abstract get type(): CellStateType;
    public cell: Cell;

    public cleanup(): void {
        this.cell = null;
    }

    public init(cell: Cell): void {
        this.cell = cell;
    }

    public abstract askRotate(): boolean;
    public abstract shouldOverrideSpriteShape(): [boolean, Shape?];
    public abstract myUpdate(dt: number): void;
}