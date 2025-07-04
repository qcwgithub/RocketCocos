import { Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { CellData } from "../CellData";
import { MySettings } from "../MySettings";
import { CellStateType } from "./CellStateType";

export class CellStateMove extends CellState {
    public override get type(): CellStateType {
        return CellStateType.Move;
    }

    public override  askRotate(): boolean {
        return false;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public moving: boolean;
    public targetPositionY: number;
    public onMoveFinish: (cell: Cell) => void;

    public override cleanup(): void {
        this.moving = false;
        this.targetPositionY = 0;
        this.onMoveFinish = null;

        super.cleanup();
    }

    public move(fromPositionY: number, toPositionY: number, onFinish: (cell: Cell) => void): void {
        this.moving = true;

        this.cell.node.y = fromPositionY;
        this.targetPositionY = toPositionY;

        this.onMoveFinish = onFinish;

        let cellData: CellData = this.cell.game.gameData.boardData.at(this.cell.x, this.cell.y);
        cellData.forbidLink = true;
    }

    public override myUpdate(dt: number): void {
        if (this.moving) {
            let y: number = this.cell.node.y;
            y -= MySettings.moveSpeed * dt;
            if (y <= this.targetPositionY) {
                y = this.targetPositionY;
            }
            this.cell.node.y = y;
            if (y <= this.targetPositionY) {
                this.finishMove();
            }
        }
    }

    public finishMove(): void {
        this.moving = false;
        let cellData: CellData = this.cell.game.gameData.boardData.at(this.cell.x, this.cell.y);
        cellData.forbidLink = false;
        this.cell.idle();
        this.onMoveFinish(this.cell);
    }
}

