import { assert, Vec2 } from "cc";
import { Cell } from "../Cell";
import { MyGame } from "../MyGame";
import { sc } from "../sc";

export class FireGroup {
    game: MyGame;
    public Init(game: MyGame): void {
        this.game = game;
        this.firing = false;
    }
    public firing: boolean;
    public poses: number[] = [];
    public onFinish: (poses: number[]) => void;
    public start(poses: number[], onFinish: (poses: number[]) => void): void {
        assert(!this.firing);

        if (!this.firing) {
            this.firing = true;
            this.poses.length = 0;
            this.poses = poses.slice();
            this.onFinish = onFinish;

            for (const pos of this.poses) {
                const [x, y] = sc.decodePos(pos);
                let cell: Cell = this.game.board.at(x, y);
                cell.fire(this.onCellFireFinish.bind(this));
            }
        }
    }

    onCellFireFinish(_cell: Cell): void {
        assert(this.firing);
        if (this.firing) {
            for (const pos of this.poses) {
                const [x, y] = sc.decodePos(pos);
                let cell: Cell = this.game.board.at(x, y);
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