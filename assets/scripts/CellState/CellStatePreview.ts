import { assert, Color, Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { sc } from "../sc";
import { MySettings } from "../MySettings";
import { CellStateType } from "./CellStateType";

export class CellStatePreview extends CellState {
    public override get type(): CellStateType {
        return CellStateType.Preview;
    }

    public override askRotate(): boolean {
        if (this.previewing) {
            this.cancelPreview();
        }
        return true;
    }

    public override willMove(): void {

    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public previewing: boolean;
    previewTimer: number;
    onPreviewFinish: (cell: Cell) => void;

    public override cleanup(): void {
        this.previewing = false;
        this.previewTimer = 0;
        this.onPreviewFinish = null;

        super.cleanup();
    }

    public preview(initTimer: number, onFinish: (cell: Cell) => void): void {
        this.cell.ping();
        // console.log(`CellStatePreview.Preview (${this.cell.x}, ${this.cell.y}) initTimer ${initTimer}`);
        assert(!this.previewing, `${this.cell.x} ${this.cell.y}`);
        this.previewing = true;
        this.previewTimer = initTimer;
        this.refresh1();
        this.onPreviewFinish = onFinish;

        // this.cell.node.setScale(MySettings.previewScale);
    }

    refresh1(): number {
        let t: number = sc.clamp01(this.previewTimer / MySettings.previewDuration);
        t *= t;
        // console.log("t = " + t)
        Color.lerp(sc.tempColor, MySettings.cellColor.previewStart, MySettings.cellColor.previewEnd, t);
        this.cell.sprite.color = sc.tempColor;
        // console.log(this.cell.sprite.color.toString())
        return t;
    }

    public override myUpdate(dt: number): void {
        if (this.previewing) {
            this.previewTimer += dt;

            // console.log("this.previewTimer " + this.previewTimer)

            let t: number = this.refresh1();
            if (t >= 1) {
                this.finishPreview();
            }
        }
    }

    public finishPreview(): void {
        assert(this.previewing);
        this.previewing = false;
        // this.cell.idle();
        // this.cell.node.setScale(Vec3.ONE);
        this.onPreviewFinish(this.cell);
    }

    public cancelPreview(): void {
        // console.log(`CellStatePreview.CancelPreview (${this.cell.x}, ${this.cell.y})`);
        assert(this.previewing);
        this.previewing = false;
        // this.cell.node.setScale(Vec3.ONE);
        // this.cell.idle();
    }
}

