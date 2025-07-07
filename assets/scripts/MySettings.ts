import { Color, Vec2, Vec3 } from "cc";

export class MySettings {
    public static readonly rotateDuration: number = 0.2;
    public static readonly previewDuration: number = 1;
    public static readonly fireTimePerCel: number = 0.2;
    public static readonly cellSize: number = 90;
    public static readonly moveSpeed: number = 400;
    public static readonly bigVec3: Vec3 = new Vec3(1.5, 1.5, 1);
    public static readonly extendTime: number = 60;
    public static readonly flySpeed: Vec2 = new Vec2(400, 400);
    public static readonly flyTime: number = 1;

    public static readonly cellColor = {
        idle: Color.WHITE,
        L: Color.YELLOW,
        R: Color.RED,
        LR: Color.GREEN,
        previewStart: Color.WHITE,
        previewEnd: new Color(255, 128, 0, 255),
        fire: Color.GREEN,
    };
}