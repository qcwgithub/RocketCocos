import {  Vec2 } from "cc";
import { Cell } from "../Cell";
import { BoardData } from "../BoardData";
import { CellData } from "../CellData";
import { Board } from "../Board";
import { MyGame } from "../MyGame";
import { sc } from "../sc";

export class MoveGroup {
    game: MyGame;
    public Init(game: MyGame): void {
        this.game = game;
    }
    
    public move(poses: number[], onCellMoveFinish: (cell: Cell) => void): void {
        // Debug.Log("OnFireFinish");

        // poses.Sort((a, b) => a.y - b.y); // y 小的在前

        let board: Board = this.game.board;
        let boardData: BoardData = this.game.gameData.boardData;

        // var frees = new List<CellData>();
        // foreach (Vector2Int pos in poses)
        // {
        //     frees.Add(boardData.Take(pos.x, pos.y));
        // }

        // int freeIndex = 0;

        var emptyY = new Set<number>();
        for (let i = 0; i < boardData.width; i++) {
            emptyY.clear();
            for (const pos of poses) {
                const [x, y] = sc.decodePos(pos);
                if (x == i) {
                    emptyY.add(y);
                }
            }

            let topY: number = 3;

            for (let j = 0; j < boardData.height; j++) {
                if (!emptyY.has(j)) {
                    continue;
                }

                let found: boolean = false;
                let j2: number = 0;
                for (j2 = j + 1; j2 < boardData.height; j2++) {
                    if (!emptyY.has(j2)) {
                        found = true;
                        break;
                    }
                }

                if (found) {
                    boardData.swap(i, j, i, j2);
                    board.swap(i, j, i, j2);
                    emptyY.delete(j);
                    emptyY.add(j2);

                    let cell: Cell = board.at(i, j);
                    cell.move(cell.node.position.y, board.getPosition(i, j).y, onCellMoveFinish);
                }
                else {
                    let cellData: CellData = boardData.at(i, j);
                    cellData.shape = this.game.gameData.randomShape();

                    let cell: Cell = board.at(i, j);
                    cell.move(topY, board.getPosition(i, j).y, onCellMoveFinish);
                    topY += 1.3;
                }
            }
        }
    }
}