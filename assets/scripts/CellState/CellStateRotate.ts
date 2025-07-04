import { assert, math, Quat } from "cc";
import { Cell } from "../Cell";
import { CellData } from "../CellData";
import { RotateDir, RotateDirExt } from "../RotateDir";
import { Shape, ShapeExt } from "../Shape";
import { CellState } from "./CellState";
import { sc } from "../sc";
import { MySettings } from "../MySettings";
import { CellStateType } from "./CellStateType";

export class CellStateRotate extends CellState {
    public override get type(): CellStateType {
        return CellStateType.Rotate;
    }

    public override askRotate(): boolean {
        return true;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        if (this.rotating) {
            return [true, this.overrideShape];
        }
        return [false];
    }

    public rotating: boolean;
    public rotateDir: RotateDir;
    rotateTimer: number;
    startRotation: Quat;
    targetRotation: Quat = new Quat();
    onRotateFinish: (cell: Cell, rotateDir: RotateDir) => void;
    overrideShape: Shape;

    public override cleanup(): void {
        this.rotating = false;
        this.rotateDir = RotateDir.Count;
        this.rotateTimer = 0;
        this.onRotateFinish = null;
        this.overrideShape = null;

        super.cleanup();
    }

    public rotate(rotateDir: RotateDir, onFinish: (cell: Cell, rotateDir: RotateDir) => void): void {
        if (this.rotating) {
            Quat.fromEuler(sc.tempQuat, 0, 0, 0);
            this.cell.node.setRotation(sc.tempQuat);
            this.cell.refresh();
        }

        // Debug.Assert(!this.rotating);
        this.rotating = true;
        this.rotateDir = rotateDir;
        this.rotateTimer = 0;
        this.startRotation = this.cell.node.rotation;
        Quat.fromEuler(sc.tempQuat, 0, 0, RotateDirExt.toRotateAngle(rotateDir));
        Quat.multiply(this.targetRotation, this.startRotation, sc.tempQuat);
        this.onRotateFinish = onFinish;

        let cellData: CellData = this.cell.game.gameData.boardData.at(this.cell.x, this.cell.y);
        this.overrideShape = cellData.shape;

        // cellData.forbidLink = true;

        cellData.shape = ShapeExt.getSettings(cellData.shape).GetRotateResult(rotateDir);
    }

    public override myUpdate(dt: number): void {
        if (this.rotating) {
            this.rotateTimer += dt;
            let t: number = sc.clamp01(this.rotateTimer / MySettings.rotateDuration);
            Quat.lerp(sc.tempQuat, this.startRotation, this.targetRotation, t)
            this.cell.node.setRotation(sc.tempQuat);
            if (t >= 1) {
                this.finishRotate();
            }
        }
    }

    public finishRotate(): void {
        assert(this.rotating);
        this.rotating = false;

        // let cellData: CellData = this.cell.game.gameData.boardData.at(this.cell.x, this.cell.y);
        // cellData.forbidLink = false;

        Quat.fromEuler(sc.tempQuat, 0, 0, 0);
        this.cell.node.setRotation(sc.tempQuat);

        this.cell.idle();

        // this.cell.Refresh();

        this.onRotateFinish(this.cell, this.rotateDir);
    }
}
