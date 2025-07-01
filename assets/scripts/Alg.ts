import { Vec2 } from "cc";
import { BoardData } from "./BoardData";
import { CellData } from "./CellData";
import { PreviewGroupData } from "./PreviewGroupData";
import { ShapeExt } from "./Shape";
import { Dir, DirExt } from "./Dir";
import { sc } from "./sc";

export class Alg {
    public static RefreshLink(board: BoardData): void {
        // reset
        for (let i = 0; i < board.width; i++) {
            for (let j = 0; j < board.height; j++) {
                let cell: CellData = board.At(i, j);
                cell.linkedL = false;
                cell.linkedR = false;
                cell.linkedLRHandled = false;

            }
        }
        board.previewGroupDatas.length = 0;

        // init L
        for (let j = 0; j < board.height; j++) {
            let cell: CellData = board.At(0, j);
            if (cell.forbidLink) {
                continue;
            }
            if (ShapeExt.GetSettings(cell.shape).linkedL) {
                cell.linkedL = true;
            }
        }
        for (let j = 0; j < board.height; j++) {
            let cell: CellData = board.At(0, j);
            if (cell.linkedL) {
                Alg.Propagate(board, 0, j, "L");
            }
        }

        // init R
        for (let j = 0; j < board.height; j++) {
            let cell: CellData = board.At(board.width - 1, j);
            if (cell.forbidLink) {
                continue;
            }
            if (ShapeExt.GetSettings(cell.shape).linkedR) {
                cell.linkedR = true;
            }
        }
        for (let j = 0; j < board.height; j++) {
            let cell: CellData = board.At(board.width - 1, j);
            if (cell.linkedR) {
                Alg.Propagate(board, board.width - 1, j, "R");
            }
        }

        for (let j = board.height - 1; j >= 0; j--) {
            for (let i = 0; i < board.width; i++) {
                let cellData: CellData = board.At(i, j);
                if (!cellData.linkedLR || cellData.linkedLRHandled) {
                    continue;
                }
                cellData.linkedLRHandled = true;

                var group = new PreviewGroupData();
                group.poses.push(new Vec2(i, j));
                board.previewGroupDatas.push(group);

                Alg.Propagate(board, i, j, "LR");
            }
        }

        //
        // #if UNITY_EDITOR
        //         for (int i = 0; i < board.previewGroupDatas.Count; i++)
        //         {
        //             var sb = new StringBuilder();
        //             sb.Append($"[{i}]");
        //             foreach (var p in board.previewGroupDatas[i].poses)
        //             {
        //                 sb.Append($"({p.x},{p.y}) ");
        //             }
        //             UnityEngine.Debug.Log(sb);
        //         }
        // #endif
    }

    static Propagate(board: BoardData, center_x: number, center_y: number, what: string): void {
        let center: CellData = board.At(center_x, center_y);
        let linkedDirs: Dir[] = ShapeExt.GetSettings(center.shape).linkedDirs;
        for (let i = 0; i < linkedDirs.length; i++) {
            let dir: Dir = linkedDirs[i];
            let offset: Vec2 = DirExt.ToOffset(dir);
            let x = center_x + offset.x;
            if (x < 0 || x >= board.width) {
                continue;
            }

            let y = center_y + offset.y;
            if (y < 0 || y >= board.height) {
                continue;
            }

            let cell: CellData = board.At(x, y);
            if (cell.forbidLink) {
                continue;
            }

            let reverseDir: Dir = DirExt.Reverse(dir);

            if (what == "L") {
                if (cell.linkedL) {
                    continue;
                }

                if (ShapeExt.GetSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    // UnityEngine.Debug.Log($"{center_x},{center_y}->{x} {y}");
                    cell.linkedL = true;
                    Alg.Propagate(board, x, y, what);
                }
            }
            else if (what == "R") {
                if (cell.linkedR) {
                    continue;
                }

                if (ShapeExt.GetSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    // UnityEngine.Debug.Log($"{center_x},{center_y}->{x} {y}");
                    cell.linkedR = true;
                    Alg.Propagate(board, x, y, what);
                }
            }
            else if (what == "LR") {
                if (!cell.linkedLR || cell.linkedLRHandled) {
                    continue;
                }

                if (ShapeExt.GetSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    cell.linkedLRHandled = true;

                    board.currentPreviewGroupData.poses.push(sc.encodePos(x, y));
                    Alg.Propagate(board, x, y, what);
                }
            }
        }
    }
}