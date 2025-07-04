import { Vec2 } from "cc";
import { BoardData } from "./BoardData";
import { CellData } from "./CellData";
import { PreviewGroupData } from "./PreviewGroupData";
import { ShapeExt } from "./Shape";
import { Dir, DirExt } from "./Dir";
import { sc } from "./sc";

export class Alg {
    public static refreshLink(boardData: BoardData): void {
        // reset
        for (let i = 0; i < boardData.width; i++) {
            for (let j = 0; j < boardData.height; j++) {
                let cell: CellData = boardData.at(i, j);
                cell.linkedL = false;
                cell.linkedR = false;
                cell.previewHandled = false;

            }
        }
        boardData.previewGroupDatas.length = 0;

        // init L
        for (let j = 0; j < boardData.height; j++) {
            let cell: CellData = boardData.at(0, j);
            if (cell.forbidLink) {
                continue;
            }
            if (ShapeExt.getSettings(cell.shape).linkedL) {
                cell.linkedL = true;
            }
        }
        for (let j = 0; j < boardData.height; j++) {
            let cell: CellData = boardData.at(0, j);
            if (cell.linkedL) {
                Alg.propagate(boardData, 0, j, "L");
            }
        }

        // init R
        for (let j = 0; j < boardData.height; j++) {
            let cell: CellData = boardData.at(boardData.width - 1, j);
            if (cell.forbidLink) {
                continue;
            }
            if (ShapeExt.getSettings(cell.shape).linkedR) {
                cell.linkedR = true;
            }
        }
        for (let j = 0; j < boardData.height; j++) {
            let cell: CellData = boardData.at(boardData.width - 1, j);
            if (cell.linkedR) {
                Alg.propagate(boardData, boardData.width - 1, j, "R");
            }
        }

        for (let j = boardData.height - 1; j >= 0; j--) {
            for (let i = 0; i < boardData.width; i++) {
                let cellData: CellData = boardData.at(i, j);
                if (!cellData.linkedLR || cellData.previewHandled) {
                    continue;
                }
                cellData.previewHandled = true;

                var group = new PreviewGroupData();
                group.poses.push(sc.encodePos(i, j));
                boardData.previewGroupDatas.push(group);

                Alg.propagate(boardData, i, j, "LR");
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

    static propagate(board: BoardData, center_x: number, center_y: number, what: string): void {
        let center: CellData = board.at(center_x, center_y);
        let linkedDirs: Dir[] = ShapeExt.getSettings(center.shape).linkedDirs;
        for (let i = 0; i < linkedDirs.length; i++) {
            let dir: Dir = linkedDirs[i];
            let x = center_x + DirExt.toOffsetX(dir);
            if (x < 0 || x >= board.width) {
                continue;
            }

            let y = center_y + DirExt.toOffsetY(dir);
            if (y < 0 || y >= board.height) {
                continue;
            }

            let cell: CellData = board.at(x, y);
            if (cell.forbidLink) {
                continue;
            }

            let reverseDir: Dir = DirExt.reverse(dir);

            if (what == "L") {
                if (cell.linkedL) {
                    continue;
                }

                if (ShapeExt.getSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    // UnityEngine.Debug.Log($"{center_x},{center_y}->{x} {y}");
                    cell.linkedL = true;
                    Alg.propagate(board, x, y, what);
                }
            }
            else if (what == "R") {
                if (cell.linkedR) {
                    continue;
                }

                if (ShapeExt.getSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    // UnityEngine.Debug.Log($"{center_x},{center_y}->{x} {y}");
                    cell.linkedR = true;
                    Alg.propagate(board, x, y, what);
                }
            }
            else if (what == "LR") {
                if (!cell.linkedLR || cell.previewHandled) {
                    continue;
                }

                if (ShapeExt.getSettings(cell.shape).linkedDirs.indexOf(reverseDir) >= 0) {
                    cell.previewHandled = true;

                    board.currentPreviewGroupData.poses.push(sc.encodePos(x, y));
                    Alg.propagate(board, x, y, what);
                }
            }
        }
    }
}