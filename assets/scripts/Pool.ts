import { Vec2, Vec3, Quat, Color } from "cc";
import { FireBall } from "./CellGroup/FireBall";

export class Pool {
    _Vec2: Vec2[] = [];
    public getVec2(): Vec2 {
        let v: Vec2;
        let L = this._Vec2.length;
        if (L > 0) {
            v = this._Vec2[L - 1];
            this._Vec2.length--;
        }
        else {
            v = new Vec2();
        }
        return v;
    }
    public putVec2(v: Vec2): void {
        this._Vec2.push(v);
    }

    ////

    _Vec3: Vec3[] = [];
    public getVec3(): Vec3 {
        let v: Vec3;
        let L = this._Vec3.length;
        if (L > 0) {
            v = this._Vec3[L - 1];
            this._Vec3.length--;
        }
        else {
            v = new Vec3();
        }
        return v;
    }
    public putVec3(v: Vec3): void {
        this._Vec3.push(v);
    }

    ////

    _Quat: Quat[] = [];
    public getQuat(): Quat {
        let v: Quat;
        let L = this._Quat.length;
        if (L > 0) {
            v = this._Quat[L - 1];
            this._Quat.length--;
        }
        else {
            v = new Quat();
        }
        return v;
    }
    public putQuat(v: Quat): void {
        this._Quat.push(v);
    }

    ////

    _Color: Color[] = [];
    public getColor(): Color {
        let v: Color;
        let L = this._Color.length;
        if (L > 0) {
            v = this._Color[L - 1];
            this._Color.length--;
        }
        else {
            v = new Color();
        }
        return v;
    }
    public putColor(v: Color): void {
        this._Color.push(v);
    }

    ////

    _FireBall: FireBall[] = [];
    public getFireBall(): FireBall {
        let v: FireBall;
        let L = this._FireBall.length;
        if (L > 0) {
            v = this._FireBall[L - 1];
            this._FireBall.length--;
        }
        else {
            v = new FireBall();
        }
        return v;
    }
    public putFireBall(v: FireBall): void {
        this._FireBall.push(v);
    }

    ////

    _NumberArray: number[][] = [];
    public getNumberArray(): number[] {
        let v: number[];
        let L = this._NumberArray.length;
        if (L > 0) {
            v = this._NumberArray[L - 1];
            this._NumberArray.length--;
        }
        else {
            v = [];
        }
        v.length = 0;
        return v;
    }
    public putNumberArray(v: number[]): void {
        v.length = 0;
        this._NumberArray.push(v);
    }
}