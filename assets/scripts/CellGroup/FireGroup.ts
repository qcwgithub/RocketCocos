import { assert, Vec2 } from "cc";
import { Cell } from "../Cell";
import { MyGame } from "../Game";

export class FireGroup {
    game: MyGame;
    public Init(game: MyGame): void {
        this.game = game;
        this.firing = false;
    }
    public firing: boolean;
    public poses: Vec2[] = [];
    public onFinish: (poses: Vec2[]) => void;
    public Start(poses: Vec2[], onFinish: (poses: Vec2[]) => void): void {
        assert(!this.firing);

        if (!this.firing) {
            this.firing = true;
            this.poses.length = 0;
            this.poses = poses.slice();
            this.onFinish = onFinish;

            for (let i = 0; i < this.poses.length; i++) {
                let pos: Vec2 = this.poses[i];
                let cell: Cell = this.game.board.At(pos.x, pos.y);
                cell.Fire(this.OnCellFireFinish);
            }
        }
    }

    OnCellFireFinish(_cell: Cell): void {
        assert(this.firing);
        if (this.firing) {
            for (let i = 0; i < this.poses.length; i++) {
                let pos: Vec2 = this.poses[i];
                let cell: Cell = this.game.board.At(pos.x, pos.y);
                if (cell.firing) {
                    return;
                }
            }

            this.firing = false;
            this.onFinish(this.poses);
        }
    }

    // public void Cancel()
    // {
    //     Debug.Assert(this.firing);
    //     if (this.firing)
    //     {
    //         this.firing = false;
    //     }
    // }
}