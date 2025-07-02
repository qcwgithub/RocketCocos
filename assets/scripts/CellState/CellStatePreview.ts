import { assert, Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { sc } from "../sc";

export class CellStatePreview extends CellState {
    public override askRotate(): boolean {
        if (this.previewing) {
            this.cancelPreview();
        }
        return true;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public previewing: boolean;
    duration_half: number;
    previewTimer: number;
    zoomIn: boolean;
    onPreviewFinish: (cell: Cell) => void;
    public preview(duration: number, initTimer: number, onFinish: (cell: Cell) => void): void {
        // Debug.LogWarning($"CellStatePreview.Preview ({this.cell.x}, {this.cell.y})");
        assert(!this.previewing, `${this.cell.x} ${this.cell.y}`);
        this.previewing = true;
        this.duration_half = duration * 0.5;
        if (initTimer < duration * 0.5) {
            this.previewTimer = initTimer;
            this.zoomIn = true;
        }
        else {
            this.previewTimer = initTimer - duration * 0.5;
            this.zoomIn = false;
            this.refresh1();
        }
        this.onPreviewFinish = onFinish;
    }

    refresh1(): number {
        let t: number = sc.clamp01(this.previewTimer / this.duration_half);

        let lerpResult = new Vec3();
        if (this.zoomIn) {
            Vec3.lerp(lerpResult, Vec3.ONE, new Vec3(1.5, 1.5, 1), t);
        }
        else {
            Vec3.lerp(lerpResult, new Vec3(1.5, 1.5, 1), Vec3.ONE, t);
        }

        this.cell.node.setScale(lerpResult);
        return t;
    }

    public override myUpdate(dt: number): void {
        if (this.previewing) {
            this.previewTimer += dt;

            let t: number = this.refresh1();

            if (this.zoomIn) {
                if (t >= 1) {
                    this.previewTimer = 0;
                    this.zoomIn = false;
                }
            }
            else {
                if (t >= 1) {
                    this.finishPreview();
                }
            }
        }
    }

    public finishPreview(): void {
        assert(this.previewing);
        this.previewing = false;
        this.cell.idle();
        this.onPreviewFinish(this.cell);
    }

    public cancelPreview(): void {
        // Debug.LogWarning($"CellStatePreview.CancelPreview ({this.cell.x}, {this.cell.y})");
        assert(this.previewing);
        this.previewing = false;
        this.cell.node.setScale(Vec3.ONE);
        this.cell.idle();
    }
}

