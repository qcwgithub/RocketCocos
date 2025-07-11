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
    onFireRocket: (y: number) => void;
    onFinish: (poses: number[]) => void;

    currentPoses: number[] = [];

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

        // node.active = true;
        return node;
    }

    putFireBallNode(node: Node): void {
        node.active = false;

        this.freeFireBallNodes.length++;
        let L: number = this.freeFireBallNodes.length;
        this.freeFireBallNodes[L - 1] = node;
    }

    public cleanup(): void {
        sc.audioManager.stopFuseBurn();

        this.game = null;
        this.firing = false;
        this.fireTimer = 0;
        this.onFireRocket = null;
        this.onFinish = null;

        this.currentPoses.length = 0;

        for (let i = 0; i < this.balls.length; i++) {
            this.putFireBallNode(this.balls[i].node);
            this.balls[i].cleanup();
        }
        this.balls.length = 0;

        assert(this.tempBalls.length == 0);
        this.tempBalls.length = 0;

        this.finalPoses.length = 0;
    }

    public startGame(game: MyGame): void {
        this.game = game;
        this.firing = false;
    }

    public start(poses: number[], onFireRocket: (y: number) => void, onFinish: (poses: number[]) => void): void {
        // console.log("FireGroup.start()");
        assert(!this.firing, "FireGroup.start() firing is alread true");

        sc.audioManager.playFuseBurn();

        if (!this.firing) {
            this.firing = true;

            this.currentPoses.length = 0;

            this.balls.length = 0;
            this.tempBalls.length = 0;

            this.finalPoses.length = 0;

            let board: Board = this.game.board;
            let boardData: BoardData = this.game.gameData.boardData;

            // 提前锁住
            for (const pos of poses) {
                const [x, y] = sc.decodePos(pos);

                let cell: Cell = board.at(x, y);
                cell.preFire();
            }

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

            this.onFireRocket = onFireRocket;
            this.onFinish = onFinish;
        }
    }

    // 往 this.balls 添加
    ballPassCell(x: number, y: number, inDir: Dir, inBall: FireBall): void {
        if (inBall == null) {
            inBall = sc.pool.getFireBall();
            inBall.start(this.game, this.allocFireBallNode(), x, y, inDir, 0);
        }

        // inBall 不是新 new 的也要加进去，因为之前已经从 balls 全部移至 tempBalls
        this.balls.push(inBall);

        inBall.append(x, y, Dir.Count);

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
                // console.log(`[${inBall.uid}] ${x} ${y} ${Dir[dir]}`);
                inBall.append(x, y, dir);
            }
            else {
                let ball = sc.pool.getFireBall();
                // console.log(`[${ball.uid}] ${x} ${y} ${Dir[Dir.Count]}`);
                ball.start(this.game, this.allocFireBallNode(), x, y, Dir.Count, MySettings.fireTimePerCel * 0.5);

                // console.log(`[${ball.uid}] ${x} ${y} ${Dir[dir]}`);
                ball.append(x, y, dir);

                this.balls.push(ball);
            }
        }
    }

    forward(): void {
        let temp = sc.pool.getNumberArray();

        for (let i = 0; i < this.currentPoses.length; i++) {
            temp.push(this.currentPoses[i]);
        }

        this.currentPoses.length = 0;

        // balls -> tempBalls
        // 仍然有效的，再重新加回 balls
        this.tempBalls.length = 0;
        for (let i = 0; i < this.balls.length; i++) {
            this.tempBalls.push(this.balls[i]);
        }
        this.balls.length = 0;

        let board: Board = this.game.board;
        let boardData: BoardData = this.game.gameData.boardData;

        for (const pos of temp) {
            const [center_x, center_y] = sc.decodePos(pos);

            let center: Cell = board.at(center_x, center_y);
            assert(center.state.type == CellStateType.Fire);

            let centerCellData: CellData = boardData.at(center_x, center_y);

            let linkedDirs: Dir[] = ShapeExt.getSettings(centerCellData.shape).linkedDirs;
            for (const dir of linkedDirs) {
                let x = center_x + DirExt.toOffsetX(dir);
                if (x < 0 || x >= boardData.width) {

                    if (dir == Dir.R && center_x == boardData.width - 1) {
                        this.onFireRocket(center_y);
                    }

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

                if (cell.state.type != CellStateType.PreFire) {
                    if (!cell.canEnterPreFire()) {
                        // console.log(`(not error)!canEnterPreFire() ${x} ${y}`);
                        continue;
                    }
                    cell.preFire();
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

                assert(bk != -1, `bk == -1 (${x} ${y} ${Dir[reverseDir]}) need (${center_x} ${center_y} ${Dir[dir]})`);

                this.ballPassCell(x, y, reverseDir, this.tempBalls[bk]);
                this.tempBalls[bk] = null;

                // console.log(`add fire ${x} ${y}`);
                this.currentPoses.push(sc.encodePos(x, y));
                this.finalPoses.push(sc.encodePos(x, y));
                cell.fire();
            }
        }

        // tempBalls 里剩下的是不再使用的
        for (let i = 0; i < this.tempBalls.length; i++) {
            if (this.tempBalls[i] != null) {
                // console.log(`delete [${this.tempBalls[i].uid}]`);
                this.putFireBallNode(this.tempBalls[i].node);
                this.tempBalls[i].cleanup();
                sc.pool.putFireBall(this.tempBalls[i]);
            }
        }
        this.tempBalls.length = 0;

        sc.pool.putNumberArray(temp);

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

            for (let i = 0; i < this.balls.length; i++) {
                this.balls[i].myUpdate(dt);
            }
        }
    }

    finishFire(): void {
        assert(this.currentPoses.length == 0, "FireGroup.finishFire() this.currentPoses.length != 0");
        assert(this.balls.length == 0, "FireGroup.finishFire() this.balls.length != 0");

        sc.audioManager.stopFuseBurn();

        for (const pos of this.finalPoses) {
            const [x, y] = sc.decodePos(pos);
            let cell: Cell = this.game.board.at(x, y);
            cell.stateFire.finishFire();
        }

        this.firing = false;
        this.onFinish(this.finalPoses);
    }
}