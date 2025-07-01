import { Vec2 } from "cc";

export class PreviewGroupData {
    public poses: Vec2[] = [];

    public Clone(): PreviewGroupData {
        var clone = new PreviewGroupData();
        clone.poses = new Array[this.poses.length];
        for (let i = 0; i < this.poses.length; i++) {
            clone.poses[i] = this.poses[i].clone();
        }
        return clone;
    }
}