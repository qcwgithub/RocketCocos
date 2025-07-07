import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { CellStateType } from "./CellStateType";

export class CellStatePreFire extends CellState {
    public override get type(): CellStateType {
        return CellStateType.PreFire;
    }

    public override askRotate(): boolean {
        return false;
    }

    public override willMove(): void {

    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false]
    }

    public override myUpdate(dt: number): void {

    }

    public preFire(): void {

    }
}