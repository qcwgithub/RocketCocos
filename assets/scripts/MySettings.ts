import { Vec2, Vec3 } from "cc";

export class MySettings {
    public static readonly rotateDuration: number = 0.2;
    public static readonly previewDuration: number = 0.4;
    public static readonly fireDuration: number = 0.2;
    public static readonly cellSize: number = 90;
    public static readonly moveSpeed: number = 400;
    public static readonly bigVec3: Vec3 = new Vec3(1.5, 1.5, 1);
    public static readonly extendTime: number = 60;
    public static readonly flySpeed: Vec2 = new Vec2(400, 400);
    public static readonly flyTime: number = 1;
}