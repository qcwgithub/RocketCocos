import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { CellStateType } from "./CellStateType";

export class CellStateIdle extends CellState {
    public override get type(): CellStateType {
        return CellStateType.Idle;
    }

    public override cleanup(): void {
        super.cleanup();
    }

    public override askRotate(): boolean {
        return true;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public override myUpdate(dt: number): void {

    }
}