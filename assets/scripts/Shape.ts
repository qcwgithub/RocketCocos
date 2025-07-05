import { assert, Vec2 } from "cc";
import { Dir } from "./Dir";
import { RotateDir } from "./RotateDir";

export enum Shape {
    L,
    R,
    T,
    B,
    LR,
    LT,
    LB,
    RT,
    RB,
    TB,
    LRT,
    LRB,
    LTB,
    RTB,
    LRTB,

    Count,
}

export class ShapeSettings {
    public linkedDirs: Dir[];
    public linkedL: boolean;
    public linkedR: boolean;
    public linkedT: boolean;
    public linkedB: boolean;
    public rotateCW: Shape;
    public rotateCCW: Shape;
    public rotateCW2: Shape;
    public rotateCCW2: Shape;

    public GetRotateResult(rotateDir: RotateDir): Shape {
        switch (rotateDir) {
            case RotateDir.CW:
                return this.rotateCW;
            case RotateDir.CCW:
                return this.rotateCCW;
            case RotateDir.CW2:
                return this.rotateCW2;
            case RotateDir.CCW2:
            default:
                return this.rotateCCW2;
        }
    }

    public isLinkDir(dir: Dir): boolean {
        return this.linkedDirs.indexOf(dir) >= 0;
    }
}

export class ShapeExt {
    public static readonly s_without1: Shape[] = [
        Shape.LR,
        Shape.LT,
        Shape.LB,
        Shape.RT,
        Shape.RB,
        Shape.TB,
        Shape.LRT,
        Shape.LRB,
        Shape.LTB,
        Shape.RTB,
        Shape.LRTB,
    ];

    static s_settings: ShapeSettings[];
    public static getSettings(e: Shape): ShapeSettings {
        assert(e != null);
        if (ShapeExt.s_settings == null) {
            ShapeExt.s_settings = [];
            for (let i = 0; i < Shape.Count; i++) {
                ShapeExt.s_settings.push(ShapeExt.createSettings(i));
            }
        }
        return ShapeExt.s_settings[e];
    }

    static createSettings(e: Shape): ShapeSettings {
        let settings = new ShapeSettings();
        settings.linkedDirs = [];

        if (settings.linkedL = ShapeExt.linked_L(e)) {
            settings.linkedDirs.push(Dir.L);
        }
        if (settings.linkedR = ShapeExt.linked_R(e)) {
            settings.linkedDirs.push(Dir.R);
        }
        if (settings.linkedT = ShapeExt.linked_T(e)) {
            settings.linkedDirs.push(Dir.T);
        }
        if (settings.linkedB = ShapeExt.linked_B(e)) {
            settings.linkedDirs.push(Dir.B);
        }
        settings.rotateCW = ShapeExt.rotateCW(e);
        settings.rotateCCW = ShapeExt.rotateCCW(e);
        settings.rotateCW2 = ShapeExt.rotateCW(settings.rotateCW);
        settings.rotateCCW2 = ShapeExt.rotateCCW(settings.rotateCCW);
        return settings;
    }

    public static canLinkTo(e: Shape, toDir: Dir): [boolean, boolean?, RotateDir?] {
        if (ShapeExt.getSettings(e).isLinkDir(toDir)) {
            return [true, false];
        }

        for (let rd: RotateDir = 0; rd < RotateDir.Count; rd++) {
            let e2: Shape = ShapeExt.getSettings(e).GetRotateResult(rd);
            if (ShapeExt.getSettings(e2).isLinkDir(toDir)) {
                return [true, true, rd];
            }
        }

        return [false];
    }

    public static canLinkTo2(e: Shape, toDir: Dir, toDir2: Dir): [boolean, boolean?, RotateDir?] {

        if (ShapeExt.getSettings(e).isLinkDir(toDir) &&
            ShapeExt.getSettings(e).isLinkDir(toDir2)) {
            return [true, false];
        }

        for (let rd: RotateDir = 0; rd < RotateDir.Count; rd++) {
            let e2: Shape = ShapeExt.getSettings(e).GetRotateResult(rd);
            if (ShapeExt.getSettings(e2).isLinkDir(toDir) &&
                ShapeExt.getSettings(e2).isLinkDir(toDir2)) {
                return [true, true, rd];
            }
        }

        return [false];
    }

    static linked_L(e: Shape): boolean {
        switch (e) {
            case Shape.L:
                return true;
            case Shape.R:
                return false;
            case Shape.T:
                return false;
            case Shape.B:
                return false;
            case Shape.LR:
                return true;
            case Shape.LT:
                return true;
            case Shape.LB:
                return true;
            case Shape.RT:
                return false;
            case Shape.RB:
                return false;
            case Shape.TB:
                return false;
            case Shape.LRT:
                return true;
            case Shape.LRB:
                return true;
            case Shape.LTB:
                return true;
            case Shape.RTB:
                return false;
            case Shape.LRTB:
            default:
                return true;
        }
    }

    static linked_R(e: Shape): boolean {
        switch (e) {
            case Shape.L:
                return false;
            case Shape.R:
                return true;
            case Shape.T:
                return false;
            case Shape.B:
                return false;
            case Shape.LR:
                return true;
            case Shape.LT:
                return false;
            case Shape.LB:
                return false;
            case Shape.RT:
                return true;
            case Shape.RB:
                return true;
            case Shape.TB:
                return false;
            case Shape.LRT:
                return true;
            case Shape.LRB:
                return true;
            case Shape.LTB:
                return false;
            case Shape.RTB:
                return true;
            case Shape.LRTB:
            default:
                return true;
        }
    }

    static linked_T(e: Shape): boolean {
        switch (e) {
            case Shape.L:
                return false;
            case Shape.R:
                return false;
            case Shape.T:
                return true;
            case Shape.B:
                return false;
            case Shape.LR:
                return false;
            case Shape.LT:
                return true;
            case Shape.LB:
                return false;
            case Shape.RT:
                return true;
            case Shape.RB:
                return false;
            case Shape.TB:
                return true;
            case Shape.LRT:
                return true;
            case Shape.LRB:
                return false;
            case Shape.LTB:
                return true;
            case Shape.RTB:
                return true;
            case Shape.LRTB:
            default:
                return true;
        }
    }

    static linked_B(e: Shape): boolean {
        switch (e) {
            case Shape.L:
                return false;
            case Shape.R:
                return false;
            case Shape.T:
                return false;
            case Shape.B:
                return true;
            case Shape.LR:
                return false;
            case Shape.LT:
                return false;
            case Shape.LB:
                return true;
            case Shape.RT:
                return false;
            case Shape.RB:
                return true;
            case Shape.TB:
                return true;
            case Shape.LRT:
                return false;
            case Shape.LRB:
                return true;
            case Shape.LTB:
                return true;
            case Shape.RTB:
                return true;
            case Shape.LRTB:
            default:
                return true;
        }
    }

    static rotateCW(e: Shape): Shape {
        switch (e) {
            case Shape.L:
                return Shape.T;
            case Shape.R:
                return Shape.B;
            case Shape.T:
                return Shape.R;
            case Shape.B:
                return Shape.L;
            case Shape.LR:
                return Shape.TB;
            case Shape.LT:
                return Shape.RT;
            case Shape.LB:
                return Shape.LT;
            case Shape.RT:
                return Shape.RB;
            case Shape.RB:
                return Shape.LB;
            case Shape.TB:
                return Shape.LR;
            case Shape.LRT:
                return Shape.RTB;
            case Shape.LRB:
                return Shape.LTB;
            case Shape.LTB:
                return Shape.LRT;
            case Shape.RTB:
                return Shape.LRB;
            case Shape.LRTB:
            default:
                return Shape.LRTB;
        }
    }

    static rotateCCW(e: Shape): Shape {
        switch (e) {
            case Shape.L:
                return Shape.B;
            case Shape.R:
                return Shape.T;
            case Shape.T:
                return Shape.L;
            case Shape.B:
                return Shape.R;
            case Shape.LR:
                return Shape.TB;
            case Shape.LT:
                return Shape.LB;
            case Shape.LB:
                return Shape.RB;
            case Shape.RT:
                return Shape.LT;
            case Shape.RB:
                return Shape.RT;
            case Shape.TB:
                return Shape.LR;
            case Shape.LRT:
                return Shape.LTB;
            case Shape.LRB:
                return Shape.RTB;
            case Shape.LTB:
                return Shape.LRB;
            case Shape.RTB:
                return Shape.LRT;
            case Shape.LRTB:
            default:
                return Shape.LRTB;
        }
    }
}