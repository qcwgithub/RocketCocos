import { Cell } from "../Cell";
import { Shape } from "../Shape";

export abstract class CellState {
    public cell: Cell;
    public init(cell: Cell): void {
        this.cell = cell;
    }

    public abstract askRotate(): boolean;
    public abstract shouldOverrideSpriteShape(): [boolean, Shape?];
    public abstract myUpdate(dt: number): void;
}