import { _decorator, assert, Component, instantiate, Node, Vec3 } from 'cc';
import { Cell } from './Cell';
import { BoardData } from './BoardData';
import { MyGame } from './MyGame';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    public cellTemplate: Node;
    // List<CCell> children = new List<CCell>();
    cells: Cell[][];

    public At(x: number, y: number): Cell {
        return this.cells[x][y];
    }

    public Swap(fromX: number, fromY: number, toX: number, toY: number): void {
        let from: Cell = this.cells[fromX][fromY];
        assert(from != null);

        let to: Cell = this.cells[toX][toY];
        assert(to != null);

        from.x = toX;
        from.y = toY;

        to.x = fromX;
        to.y = fromY;

        this.cells[fromX][fromY] = to;
        this.cells[toX][toY] = from;
    }

    public get width(): number {
        return this.game.gameData.boardData.width;
    }
    public get height(): number {
        return this.game.gameData.boardData.height;
    }

    public game: MyGame;
    public boardData: BoardData;
    public Init(game: MyGame): void {
        this.game = game;
        this.boardData = game.gameData.boardData;
        for (const child of this.node.children) {
            child.active = false;
        }

        while (this.node.children.length < this.width * this.height) {
            let node = instantiate(this.cellTemplate);
            node.setParent(this.node);
        }

        this.cells = new Cell[this.width, this.height];

        let children: Node[] = this.node.children;

        let index: number = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let cell: Cell = this.cells[i][j] = children[index++].getComponent(Cell);
                cell.node.active = true;
                // cell.gameObject.name = $"({i},{j})";
                cell.Init(this.game, i, j);

                cell.node.setPosition(this.GetPosition(i, j));
            }
        }
        // this.RefreshColors();
    }

    // public void RefreshColors()
    // {
    //     for (int i = 0; i < this.width; i++)
    //     {
    //         for (int j = 0; j < this.height; j++)
    //         {
    //             this.At(i, j).ApplyColor();
    //         }
    //     }
    // }

    public GetPosition(i: number, j: number): Vec3 {
        return new Vec3(
            -this.width * 0.5 + 0.5 + i,
            -this.height * 0.5 + 0.5 + j,
            0
        );
    }

    public Refresh(): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.At(i, j).Refresh();
            }
        }
    }
}


