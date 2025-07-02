import { Shape } from "../Shape";
import { CellState } from "./CellState";

export class CellStateIdle extends CellState {
    public override askRotate(): boolean {
        return true;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public override myUpdate(dt: number): void {

    }
}