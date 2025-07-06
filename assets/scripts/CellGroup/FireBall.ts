import { Node, Vec2, Vec3 } from "cc";
import { sc } from "../sc";
import { MySettings } from "../MySettings";
import { Dir } from "../Dir";
import { MyGame } from "../MyGame";
import { Board } from "../Board";

class FireBallTarget {
    public x: number;
    public y: number;
    public dir: Dir; // Count = center

    constructor(x: number, y: number, dir: Dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
    }
}

export class FireBall {
    game: MyGame;
    public node: Node;
    targets: FireBallTarget[] = [];
    delay: number;
    timer: number;
    index: number;
    DURATION: number;

    public cleanup(): void {
        this.game = null;
        this.node = null;
        this.targets.length = 0;
        this.delay = 0;
        this.timer = 0;
        this.index = 0;
        this.DURATION = 0;
    }

    public start(game: MyGame, node: Node, x: number, y: number, dir: Dir, delay: number): void {
        this.game = game;
        this.node = node;
        this.targets.length = 0;

        let target = new FireBallTarget(x, y, dir);
        this.targets.push(target);

        this.delay = delay;

        this.timer = 0;
        this.index = 0;
        this.DURATION = MySettings.fireTimePerCel * 0.5;

        this.node.setPosition(this.getPosition(target));
    }

    public lastTargetIs(x: number, y: number, dir: Dir): boolean {
        let L = this.targets.length;
        if (L == 0) {
            return false;
        }

        let last: FireBallTarget = this.targets[L - 1];
        if (last.x == x && last.y == y && last.dir == dir) {
            return true;
        }
        return false;
    }

    getPosition(target: FireBallTarget): Vec3 {
        let board: Board = this.game.board;

        let position: Vec3 = new Vec3();

        if (target.dir == Dir.Count) {
            position.x = board.getPositionX(target.x);
            position.y = board.getPositionY(target.y);
        }
        else {
            position.x = board.getPositionSideX(target.x, target.dir);
            position.y = board.getPositionSideY(target.y, target.dir);
        }

        position.z = 0;

        return position;
    }

    public append(x: number, y: number, dir: Dir): void {
        this.targets.length++;
        let L: number = this.targets.length;
        this.targets[L - 1] = new FireBallTarget(x, y, dir);
    }

    public myUpdate(dt: number): void {
        if (this.delay > 0){
            if (this.delay >= dt){
                this.delay -= dt;
                return;
            }

            dt += dt - this.delay;
            this.delay = 0;
        }
        this.timer += dt;
        while (this.timer >= this.DURATION) {
            this.timer -= this.DURATION;
            this.index++;
        }

        let L: number = this.targets.length;
        if (this.index < L - 1) {
            let t: number = this.timer / this.DURATION;

            let from: Vec3 = this.getPosition(this.targets[this.index]);
            let to: Vec3 = this.getPosition(this.targets[this.index + 1]);
            Vec3.lerp(sc.tempVec3, from, to, t);
            this.node.setPosition(sc.tempVec3);
        }
        else if (this.index == L - 1) {
            this.node.setPosition(this.getPosition(this.targets[L - 1]));
        }
    }
}