import { assert, Vec2 } from "cc";
import { Cell } from "../Cell";
import { PreviewGroupData } from "../PreviewGroupData";
import { MyGame } from "../MyGame";
import { sc } from "../sc";

export class PreviewGroup {
    game: MyGame;
    public Init(game: MyGame): void {
        this.game = game;
        this.previewing = false;
    }

    static DURATION: number = 0.4;

    public previewing: boolean;
    startTime: number;
    public poses: number[] = [];
    onFinish: (poses: number[]) => void;
    public Start(previewGroupData: PreviewGroupData, onFinish: (poses: number[]) => void): void {
        assert(!this.previewing);
        this.previewing = true;
        this.poses.length = 0;
        this.poses = previewGroupData.poses.slice();
        this.onFinish = onFinish;

        this.startTime = this.game.time;
        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.At(x, y);
            cell.Preview(PreviewGroup.DURATION, 0, this.OnCellPreviewFinish);
        }
    }

    OnCellPreviewFinish(_cell: Cell): void {
        assert(this.previewing);
        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.At(x, y);
            if (cell.previewing) {
                return;
            }
        }

        this.previewing = false;
        this.onFinish(this.poses);
    }

    public Cancel(): void {
        // Debug.LogWarning("PreviewGroup.Cancel");
        assert(this.previewing);
        this.previewing = false;

        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.At(x, y);
            if (cell.previewing) {
                cell.statePreview.CancelPreview();
            }
        }
    }

    StillValid(previewGroupDatas: PreviewGroupData[]): [boolean, PreviewGroupData?] {
        if (previewGroupDatas.length == 0) {
            return [false];
        }

        var posesL: number[] = [];
        var posesR: number[] = [];
        for (const pos of this.poses) {
            const [x, y] = sc.decodePos(pos);
            if (x == 0) {
                posesL.push(pos);
            }
            else if (x == this.game.gameData.boardData.width - 1) {
                posesR.push(pos);
            }
        }
        assert(posesL.length > 0);
        assert(posesR.length > 0);

        let curr: PreviewGroupData = null;

        //
        for (const previewGroupData of previewGroupDatas) {
            let containsAnyL = false;
            for (const pos of posesL) {
                if (previewGroupData.poses.indexOf(pos) >= 0) {
                    containsAnyL = true;
                    break;
                }
            }

            if (!containsAnyL) {
                continue;
            }

            let containsAnyR = false;
            for (const pos of posesR) {
                if (previewGroupData.poses.indexOf(pos) >= 0) {
                    containsAnyR = true;
                    break;
                }
            }

            if (!containsAnyR) {
                continue;
            }

            curr = previewGroupData;
            break;
        }

        if (curr == null) {
            return [false];
        }
        return [true, curr];
    }

    public UpdatePreview(previewGroupDatas: PreviewGroupData[]): void {
        assert(this.previewing);
        if (!this.previewing) {
            return;
        }

        const [stillValid, curr_previewGroupData] = this.StillValid(previewGroupDatas);

        if (!stillValid) {
            this.Cancel();
            return;
        }

        // -preview
        for (const pos of this.poses) {
            if (curr_previewGroupData.poses.indexOf(pos) < 0) {
                const [x, y] = sc.decodePos(pos);
                let cell: Cell = this.game.board.At(x, y);
                if (cell.previewing) {
                    cell.statePreview.CancelPreview();
                }
            }
        }

        this.poses.length;
        this.poses = curr_previewGroupData.poses.slice();

        let now: number = this.game.time;
        let initTimer: number = now - this.startTime;
        // +preview
        for (const pos of this.poses) {
                const [x, y] = sc.decodePos(pos);
            let cell: Cell = this.game.board.At(x, y);
            if (!cell.previewing) {
                cell.Preview(PreviewGroup.DURATION, initTimer, this.OnCellPreviewFinish);
            }
        }
    }
}