import { _decorator, assert, Component, instantiate, Node, Vec3 } from 'cc';
import { Cell } from './Cell';
import { BoardData } from './BoardData';
import { MyGame } from './MyGame';
import { MySettings } from './MySettings';
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    @property({ type: Node })
    public cellBgTemplate: Node;
    @property({ type: Node })
    public cellTemplate: Node;

    cells: Cell[][];

    public game: MyGame;
    public boardData: BoardData;
    public init(game: MyGame): void {
        this.game = game;
        this.boardData = game.gameData.boardData;

        this.initCellBgs();
        this.initCells();
    }

    initCellBgs() {
        let parent: Node = this.cellBgTemplate.parent;

        for (const child of parent.children) {
            child.active = false;
        }

        while (parent.children.length < this.width * this.height) {
            let node = instantiate(this.cellBgTemplate);
            node.setParent(parent);
        }

        let children: Node[] = parent.children;

        let index: number = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let child: Node = children[index++];
                child.active = true;
                child.setPosition(this.getPosition(i, j));
            }
        }
    }

    initCells() {
        let parent: Node = this.cellTemplate.parent;

        for (const child of parent.children) {
            child.active = false;
        }

        while (parent.children.length < this.width * this.height) {
            let node = instantiate(this.cellTemplate);
            node.setParent(parent);
        }

        this.cells = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.cells[x] = new Array(this.height);
        }

        let children: Node[] = parent.children;

        let index: number = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let cell: Cell = children[index++].getComponent(Cell);
                this.cells[i][j] = cell;
                cell.node.active = true;
                // cell.gameObject.name = $"({i},{j})";
                cell.init(this.game, i, j);

                cell.node.setPosition(this.getPosition(i, j));
            }
        }
    }

    public at(x: number, y: number): Cell {
        return this.cells[x][y];
    }

    public swap(fromX: number, fromY: number, toX: number, toY: number): void {
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

    public getPositionY(j: number): number {
        return (-this.height * 0.5 + 0.5 + j) * MySettings.cellSize;
    }

    public getPosition(i: number, j: number): Vec3 {
        return new Vec3(
            (-this.width * 0.5 + 0.5 + i) * MySettings.cellSize,
            this.getPositionY(j),
            0
        );
    }

    public refresh(): void {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.at(i, j).refresh();
            }
        }
    }
}


