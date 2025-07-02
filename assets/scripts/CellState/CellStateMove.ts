import { Vec3 } from "cc";
import { Cell } from "../Cell";
import { Shape } from "../Shape";
import { CellState } from "./CellState";
import { CellData } from "../CellData";

export class CellStateMove extends CellState {
    public override  askRotate(): boolean {
        return false;
    }

    public override shouldOverrideSpriteShape(): [boolean, Shape?] {
        return [false];
    }

    public moving: boolean;
    public targetPositionY: number;
    public onMoveFinish: (cell: Cell) => void;

    public move(fromPositionY: number, toPositionY: number, onFinish: (cell: Cell) => void): void {
        this.moving = true;

        let position: Vec3 = this.cell.node.position;
        position.y = fromPositionY;
        this.cell.node.setPosition(position);

        this.targetPositionY = toPositionY;
        this.onMoveFinish = onFinish;

        let cellData: CellData = this.cell.game.gameData.boardData.at(this.cell.x, this.cell.y);
        cellData.forbidLink = true;
    }

    public override myUpdate(dt: number): void {
        if (this.moving) {
            let position: Vec3 = this.cell.node.position;
            position.y -= 4 * dt;
            if (position.y <= this.targetPositionY) {
                position.y = this.targetPositionY;
            }
            this.cell.node.setPosition(position);
            if (position.y <= this.targetPositionY) {
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

