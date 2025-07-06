import { assert, instantiate, Node, Vec2 } from "cc";
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
import { FireBall } from "./FireBall";

export class FireGroup {
    game: MyGame;
    public firing: boolean;
    fireTimer: number;
    public onFinish: (poses: number[]) => void;

    currentPoses: number[] = [];
    tempPoses: number[] = [];

    balls: FireBall[] = [];
    tempBalls: FireBall[] = [];

    finalPoses: number[] = [];

    freeFireBallNodes: Node[] = [];
    allocFireBallNode(): Node {
        let node: Node;
        let L: number = this.freeFireBallNodes.length;
        if (L > 0) {
            node = this.freeFireBallNodes[L - 1];
            this.freeFireBallNodes.length--;
        }
        else {
            node = instantiate(this.game.fireBallTemplate);
            node.setParent(this.game.fireBallTemplate.parent);
        }

        node.active = true;
        return node;
    }

    putFireBallNode(node: Node): void {
        node.active = false;

        this.freeFireBallNodes.length++;
        let L: number = this.freeFireBallNodes.length;
        this.freeFireBallNodes[L - 1] = node;
    }

    public cleanup(): void {
        this.game = null;
        this.firing = false;
        this.fireTimer = 0;
        this.onFinish = null;

        this.currentPoses.length = 0;
        this.tempPoses.length = 0;

        this.balls.length = 0;
        this.tempBalls.length = 0;

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
            this.tempPoses.length = 0;

            this.balls.length = 0;
            this.tempBalls.length = 0;

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

                this.ballPassCell(x, y, Dir.L, null);

                this.currentPoses.push(pos);
                this.finalPoses.push(pos);

                let cell: Cell = board.at(x, y);
                cell.fire();
            }

            this.onFinish = onFinish;
        }
    }

    ballPassCell(x: number, y: number, inDir: Dir, inBall: FireBall): void {
        if (inBall == null) {
            inBall = new FireBall();
            inBall.start(this.game, this.allocFireBallNode(), x, y, inDir, 0);
        }
        inBall.append(x, y, Dir.Count);
        this.balls.push(inBall);

        let boardData: BoardData = this.game.gameData.boardData;

        let cellData: CellData = boardData.at(x, y);

        let inBallUsed: boolean = false;

        let linkedDirs: Dir[] = ShapeExt.getSettings(cellData.shape).linkedDirs;
        for (const dir of linkedDirs) {
            if (dir == inDir) {
                continue;
            }

            if (!inBallUsed) {
                inBallUsed = true;
                inBall.append(x, y, dir);
            }
            else {
                let ball = new FireBall();
                ball.start(this.game, this.allocFireBallNode(), x, y, Dir.Count, MySettings.fireDuration * 0.5);
                ball.append(x, y, dir);

                this.balls.push(ball);
            }
        }
    }

    forward(): void {
        this.tempPoses.length = 0;
        for (let i = 0; i < this.currentPoses.length; i++) {
            this.tempPoses.push(this.currentPoses[i]);
        }
        this.currentPoses.length = 0;

        this.tempBalls.length = 0;
        for (let i = 0; i < this.balls.length; i++) {
            this.tempBalls.push(this.balls[i]);
        }
        this.balls.length = 0;

        let board: Board = this.game.board;
        let boardData: BoardData = this.game.gameData.boardData;

        for (const pos of this.tempPoses) {
            const [center_x, center_y] = sc.decodePos(pos);

            let center: Cell = board.at(center_x, center_y);
            assert(center.state.type == CellStateType.Fire);

            let centerCellData: CellData = boardData.at(center_x, center_y);

            let linkedDirs: Dir[] = ShapeExt.getSettings(centerCellData.shape).linkedDirs;
            for (const dir of linkedDirs) {
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

                if (!ShapeExt.getSettings(cellData.shape).isLinkDir(reverseDir)) {
                    continue;
                }

                let bk = -1;
                for (let k = 0; k < this.tempBalls.length; k++) {
                    if (this.tempBalls[k] != null &&
                        this.tempBalls[k].lastTargetIs(center_x, center_y, dir)
                    ) {
                        bk = k;
                        break;
                    }
                }

                assert(bk != -1, "bk == -1");

                this.ballPassCell(x, y, reverseDir, this.tempBalls[bk]);
                this.tempBalls[bk] = null;

                // console.log(`add fire ${x} ${y}`);
                this.currentPoses.push(sc.encodePos(x, y));
                this.finalPoses.push(sc.encodePos(x, y));
                cell.fire();
            }
        }

        for (let i = 0; i < this.tempBalls.length; i++) {
            if (this.tempBalls[i] != null) {
                this.putFireBallNode(this.tempBalls[i].node);
                this.tempBalls[i].cleanup();
            }
        }

        this.tempPoses.length = 0;

        if (this.currentPoses.length == 0) {
            this.finishFire();
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