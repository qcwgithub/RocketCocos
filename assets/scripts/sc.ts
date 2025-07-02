import { Quat, Vec3 } from "cc";
import { ConfigManager } from "./ConfigManager";
import { MyGame } from "./MyGame";
import { Bootstrap } from "./Bootstrap";
import { MyAssets } from "./MyAssets";

export class sc {
    public static bootstrap: Bootstrap;
    public static game: MyGame;
    public static myAssets: MyAssets;
    public static configManager: ConfigManager;

    public static tempVec3: Vec3 = new Vec3();
    public static tempQuat: Quat = new Quat();

    public static clamp01(value: number): number {
        return Math.min(1, Math.max(0, value));
    }

    public static encodePos(x: number, y: number): number {
        return x * 100 + y;
    }
    public static decodePos(v: number): [number, number] {
        let y = v % 100;
        let x = (v - y) / 100;
        return [x, y];
    }
}


