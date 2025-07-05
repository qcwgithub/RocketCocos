import { Node, Vec2, Vec3 } from "cc";
import { sc } from "../sc";
import { MySettings } from "../MySettings";

export class FireBall {
    public node: Node;
    targets: Vec3[] = [];
    index: number;
    timer: number;
    DURATION: number;
    end: boolean;

    public start(node: Node, x: number, y: number): void {
        this.node = node;
        this.targets.length = 0;
        this.targets.push(new Vec3(x, y, 0));
        this.index = 0;
        this.timer = 0;
        this.DURATION = MySettings.fireTimePerCel * 0.5;
        this.end = false;

        this.node.setPosition(this.targets[0]);
    }

    public cleanup(): void {

    }

    public append(x: number, y: number, end: boolean): void {
        this.targets.length++;
        let L: number = this.targets.length;
        this.targets[L - 1] = new Vec3(x, y, 0);
        this.end = end;
    }

    public myUpdate(dt: number): void {
        this.timer += dt;
        while (this.timer >= this.DURATION) {
            if (this.index < this.targets.length - 1) {
                this.index++;
                this.timer -= this.DURATION;
            }
            else if (this.end) {

            }
        }

        let t: number = this.timer / this.DURATION;
        Vec3.lerp(sc.tempVec3, this.targets[this.index], this.targets[this.index + 1], t);

        this.node.setPosition(sc.tempVec3);
    }
}