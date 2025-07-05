import { assert, Vec2 } from "cc";
import { Cell } from "../Cell";
import { MyGame } from "../MyGame";
import { sc } from "../sc";
import { CellStateType } from "../CellState/CellStateType";
import { BoardData } from "../BoardData";
import { CellData } from "../CellData";
import { MySettings } from "../MySettings";
import { ShapeExt } from "../Shape";
import { Dir, DirExt } from "../Dir";
import { Board } from "../Board";

export class FireGroup {
    game: MyGame;
    public firing: boolean;
    fireTimer: number;
    public onFinish: (poses: number[]) => void;
    currentPoses: number[] = [];
    tempPoses: number[] = [];
    finalPoses: number[] = [];

    public cleanup(): void {
        this.game = null;
        this.firing = false;
        this.fireTimer = 0;
        this.onFinish = null;
        this.currentPoses.length = 0;
        this.tempPoses.length = 0;
        this.finalPoses.length = 0;
    }

    public startGame(game: MyGame): void {
        this.game = game;
        this.firing = false;
    }

    public start(poses: number[], onFinish: (poses: number[]) => void): void {
        assert(!this.firing);

        if (!this.firing) {
            this.firing = true;

            this.currentPoses.length = 0;
            this.finalPoses.length = 0;

            let board: Board = this.game.board;
            let boardData: BoardData = this.game.gameData.boardData;

            for (const pos of poses) {
                const [x, y] = sc.decodePos(pos);
                if (x != 0) {
                    continue;
                }

                let cellData: CellData = boardData.at(x, y);
                if (!ShapeExt.getSettings(cellData.shape).isLinkDir(Dir.L)) {
                    continue;
                }

                this.currentPoses.push(pos);
                this.finalPoses.push(pos);

                let cell: Cell = board.at(x, y);
                cell.fire();
            }

            this.onFinish = onFinish;
        }
    }

    forward(): void {
        this.tempPoses.length = 0;

        let board: Board = this.game.board;
        let boardData: BoardData = this.game.gameData.boardData;

        for (const pos of this.currentPoses) {
            const [center_x, center_y] = sc.decodePos(pos);

            let center: Cell = board.at(center_x, center_y);
            assert(center.state.type == CellStateType.Fire);

            let centerCellData: CellData = boardData.at(center_x, center_y);

            let linkedDirs: Dir[] = ShapeExt.getSettings(centerCellData.shape).linkedDirs;
            for (let i = 0; i < linkedDirs.length; i++) {
                let dir: Dir = linkedDirs[i];
                let x = center_x + DirExt.toOffsetX(dir);
                if (x < 0 || x >= boardData.width) {
                    continue;
                }

                let y = center_y + DirExt.toOffsetY(dir);
                if (y < 0 || y >= boardData.height) {
                    continue;
                }

                let cell: Cell = board.at(x, y);
                if (cell.state.type == CellStateType.Fire) {
                    continue;
                }

                let cellData: CellData = boardData.at(x, y);
                if (!cellData.linkedLR) {
                    continue;
                }

                let reverseDir: Dir = DirExt.reverse(dir);

                if (ShapeExt.getSettings(cellData.shape).isLinkDir(reverseDir)) {
                    // console.log(`add fire ${x} ${y}`);
                    this.tempPoses.push(sc.encodePos(x, y));
                    this.finalPoses.push(sc.encodePos(x, y));
                    cell.fire();
                }
            }
        }

        if (this.tempPoses.length == 0) {
            this.finishFire();
        }
        else {
            this.currentPoses.length = 0;
            for (const pos of this.tempPoses) {
                this.currentPoses.push(pos);
            }
            this.tempPoses.length = 0;
        }
    }

    public myUpdate(dt: number): void {
        if (this.firing) {
            this.fireTimer += dt;
            while (this.fireTimer >= MySettings.fireTimePerCel) {
                this.fireTimer -= MySettings.fireTimePerCel;

                this.forward();
                if (!this.firing) {
                    break;
                }
            }
        }
    }

    finishFire(): void {
        for (const pos of this.finalPoses) {
            const [x, y] = sc.decodePos(pos);
            let cell: Cell = this.game.board.at(x, y);
            cell.stateFire.finishFire();
        }

        this.firing = false;
        this.onFinish(this.finalPoses);
    }
}