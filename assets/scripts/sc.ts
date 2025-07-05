import { Color, instantiate, Node, Quat, Vec3 } from "cc";
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
    public static tempVec3_2: Vec3 = new Vec3();
    public static tempVec3_3: Vec3 = new Vec3();
    public static tempQuat: Quat = new Quat();
    public static tempColor: Color = new Color();

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
}


