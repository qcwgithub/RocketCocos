export enum RotateDir {
    CW,
    CCW,
    CW2,
    CCW2,

    Count,
}

export class RotateDirExt {
    public static ToRotateAngle(e: RotateDir): number {
        switch (e) {
            case RotateDir.CW:
                return -90;
            case RotateDir.CCW:
                return 90;
            case RotateDir.CW2:
                return -180;
            case RotateDir.CCW2:
            default:
                return 180;
        }
    }
}