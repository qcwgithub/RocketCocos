import { assert, Vec2 } from "cc";
import { Cell } from "../Cell";
import { PreviewGroupData } from "../PreviewGroupData";
import { MyGame } from "../MyGame";
import { sc } from "../sc";
import { CellStateType } from "../CellState/CellStateType";

export class PreviewGroup {
    game: MyGame;
    public previewing: boolean;
    startTime: number;
    public poses: number[];
    onFinish: (poses: number[]) => void;

    onCellPreviewFinish_bind: (cell: Cell) => void;
    public cleanup(): void {
        this.game = null;
        this.previewing = false;
        this.startTime = 0;
        this.poses = null;
        this.onFinish = null;

        this.onCellPreviewFinish_bind = null;
    }

    public startGame(game: MyGame): void {
        this.game = game;
        this.previewing = false;

        this.onCellPreviewFinish_bind = this.onCellPreviewFinish.bind(this);
    }

    public start(previewGroupData: PreviewGroupData, onFinish: (poses: number[]) => void): void {
        sc.audioManager.playPreview();
        assert(!this.previewing);
        this.previewing = true;
        this.poses = previewGroupData.poses.slice();
        this.onFinish = onFinish;

        this.startTime = sc.time();
        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.at(x, y);
            cell.preview(0, this.onCellPreviewFinish_bind);
        }
    }

    onCellPreviewFinish(_cell: Cell): void {
        assert(this.previewing);
        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.at(x, y);
            if (cell.previewing) {
                return;
            }
        }

        this.previewing = false;
        this.onFinish(this.poses);
    }

    public cancel(): void {
        // Debug.LogWarning("PreviewGroup.Cancel");
        assert(this.previewing);
        this.previewing = false;

        for (let i = 0; i < this.poses.length; i++) {
            const [x, y] = sc.decodePos(this.poses[i]);
            let cell: Cell = this.game.board.at(x, y);
            if (cell.previewing) {
                cell.statePreview.cancelPreview();
            }
        }
    }

    stillValid(previewGroupDatas: PreviewGroupData[]): [boolean, PreviewGroupData?] {
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

    public updatePreview(previewGroupDatas: PreviewGroupData[]): void {
        assert(this.previewing);
        if (!this.previewing) {
            return;
        }

        const [stillValid, curr_previewGroupData] = this.stillValid(previewGroupDatas);

        if (!stillValid) {
            this.cancel();
            return;
        }

        // -preview
        for (const pos of this.poses) {
            if (curr_previewGroupData.poses.indexOf(pos) < 0) {
                const [x, y] = sc.decodePos(pos);
                let cell: Cell = this.game.board.at(x, y);
                if (cell.previewing) {
                    cell.statePreview.cancelPreview();
                }
            }
        }

        this.poses.length;
        this.poses = curr_previewGroupData.poses.slice();

        let now: number = sc.time();
        let initTimer: number = now - this.startTime;
        // +preview
        for (const pos of this.poses) {
            const [x, y] = sc.decodePos(pos);
            let cell: Cell = this.game.board.at(x, y);
            if (!cell.previewing) {
                cell.preview(initTimer, this.onCellPreviewFinish_bind);
            }
        }
    }
}