import { Quat, Vec3 } from "cc";
import { ConfigManager } from "./ConfigManager";
import { MyGame } from "./MyGame";
import { Bootstrap } from "./Bootstrap";
import { MyAssets } from "./MyAssets";
import { Profile } from "./Profile";
import { PanelManager } from "./PanelManager";

export class sc {
    public static bootstrap: Bootstrap;
    public static panelManager: PanelManager;
    public static myAssets: MyAssets;
    public static configManager: ConfigManager;
    public static profile: Profile;

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

    // public static timeMs(): number {
    //     return Date.now();
    // }

    public static timeInt(): number {
        return Math.floor(Date.now() / 1000);
    }

    public static time(): number {
        return Date.now() / 1000;
    }
}


