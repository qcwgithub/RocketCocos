import { assert, Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { sc } from "../sc";
import { MySettings } from "../MySettings";
import { CellStateType } from "./CellStateType";

export class CellStateFire extends CellState {
    public override get type(): CellStateType {
        return CellStateType.Fire;
    }

    public override askRotate(): boolean {
        return false;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false]
    }

    public firing: boolean;

    public override cleanup(): void {
        this.firing = false;

        super.cleanup();
    }

    public fire(): void {
        assert(!this.firing);
        this.firing = true;

        this.cell.sprite.color = MySettings.cellColor.fire;
    }

    public override myUpdate(dt: number): void {
    }

    public finishFire(): void {
        assert(this.firing);
        this.firing = false;
        this.cell.idle();
    }
}
