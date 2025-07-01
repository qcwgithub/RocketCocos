import { Cell } from "../Cell";
import { Shape } from "../Shape";

export abstract class CellState {
    public cell: Cell;
    public Init(cell: Cell): void {
        this.cell = cell;
    }

    public abstract AskRotate(): boolean;
    public abstract OverrideSpriteShape(): [boolean, Shape?];
    public abstract MyUpdate(dt: number): void;
}