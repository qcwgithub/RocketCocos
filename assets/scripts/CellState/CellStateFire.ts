import { assert, Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { sc } from "../sc";

export class CellStateFire extends CellState {
    public override askRotate(): boolean {
        return false;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false]
    }

    public firing: boolean;
    fireTimer: number;
    onFireFinish: (cell: Cell) => void;
    public fire(onFinish: (cell: Cell) => void): void {
        assert(!this.firing);
        this.firing = true;
        this.fireTimer = 0;
        this.onFireFinish = onFinish;
    }

    public override myUpdate(dt: number): void {
        if (this.firing) {
            this.fireTimer += dt;
            let t: number = sc.clamp01(this.fireTimer / 0.2);

            let lerpResult = new Vec3();
            Vec3.lerp(lerpResult, Vec3.ONE, Vec3.ZERO, t);
            this.cell.node.setScale(lerpResult);
            if (t >= 1) {
                this.finishFire();
            }
        }
    }

    public finishFire(): void {
        assert(this.firing);
        this.firing = false;
        this.cell.node.setScale(Vec3.ONE);
        this.cell.idle();
        this.onFireFinish(this.cell);
    }
}
