import { assert, Vec2 } from "cc";

export enum Dir {
    L,
    R,
    T,
    B,

    Count,
}

export class DirExt {
    public static reverse(e: Dir): Dir {
        switch (e) {
            case Dir.L:
                return Dir.R;
            case Dir.R:
                return Dir.L;
            case Dir.T:
                return Dir.B;
            case Dir.B:
            default:
                return Dir.T;
        }
    }

    public static fromOffset(x: number, y: number): Dir {
        assert(x != 0 || y != 0);
        assert(x == 0 || y == 0);

        if (y == 0) {
            return x < 0 ? Dir.L : Dir.R;
        }
        else {
            return y > 0 ? Dir.T : Dir.B;
        }
    }

    public static toOffsetX(e: Dir): number {
        switch (e) {
            case Dir.L:
                return -1;
            case Dir.R:
                return 1;
            case Dir.T:
                return 0;
            case Dir.B:
            default:
                return 0;
        }
    }

    public static toOffsetY(e: Dir): number {
        switch (e) {
            case Dir.L:
                return 0;
            case Dir.R:
                return 0;
            case Dir.T:
                return 1;
            case Dir.B:
            default:
                return -1;
        }
    }

    public static toOffset(e: Dir): Vec2 {
        switch (e) {
            case Dir.L:
                return new Vec2(-1, 0);
            case Dir.R:
                return new Vec2(1, 0);
            case Dir.T:
                return new Vec2(0, 1);
            case Dir.B:
            default:
                return new Vec2(0, -1);
        }
    }
}