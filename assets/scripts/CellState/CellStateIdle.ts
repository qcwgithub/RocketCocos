import { Shape } from "../Shape";
import { CellState } from "./CellState";

export class CellStateIdle extends CellState {
    public override AskRotate(): boolean {
        return true;
    }

    public override OverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public override MyUpdate(dt: number): void {

    }
}