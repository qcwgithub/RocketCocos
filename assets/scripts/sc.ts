import { Color, instantiate, Node, Quat, Vec3 } from "cc";
import { ConfigManager } from "./ConfigManager";
import { MyGame } from "./MyGame";
import { Bootstrap } from "./Bootstrap";
import { MyAssets } from "./MyAssets";
import { Profile } from "./Profile";
import { PanelManager } from "./PanelManager";
import { AudioManager } from "./AudioManager";
import { Pool } from "./Pool";

export class sc {
    public static bootstrap: Bootstrap;
    public static panelManager: PanelManager;
    public static myAssets: MyAssets;
    public static configManager: ConfigManager;
    public static game: MyGame;
    public static profile: Profile;
    public static audioManager: AudioManager;
    public static pool: Pool;

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

    public static showChildren(parent: Node, count: number): void {
        let children: Node[] = parent.children;
        for (let i = 0; i < children.length; i++) {
            children[i].active = i < count;
        }
    }

    public static hideChildren(parent: Node): void {
        sc.showChildren(parent, 0);
    }

    public static instantiateChildren(template: Node, L: number, callback: (index: number, child: Node) => void): void {
        let parent: Node = template.parent;

        let childCount = parent.children.length;
        for (let i = 0; i < L - childCount; i++) {
            let child: Node = instantiate(template);
            child.setParent(parent);
        }

        let children: Node[] = parent.children;
        for (let i = 0; i < L; i++) {
            let child: Node = children[i];
            child.active = true;

            if (callback != null) {
                callback(i, child);
            }
        }
    }

    static padZero(v: number): string {
        if (v == 0) {
            return "00";
        }
        else if (v < 10) {
            return "0" + v;
        }
        else {
            return v.toString();
        }
    }

    public static formatTime(t: number): string {
        return sc.padZero(Math.floor(t / 60)) + ":" + sc.padZero(t % 60);
    }
}
