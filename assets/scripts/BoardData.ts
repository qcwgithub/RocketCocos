import { assert } from "cc";
import { CellData } from "./CellData";
import { PreviewGroupData } from "./PreviewGroupData";

export class BoardData {
    public width: number;
    public height: number;
    public cells: CellData[][];
    public previewGroupDatas: PreviewGroupData[];

    public init(width: number, height: number): void {
        this.width = width;
        this.height = height;

        this.cells = new Array(width);
        for (let x = 0; x < width; x++) {
            this.cells[x] = new Array(height);
            for (let y = 0; y < height; y++) {
                this.cells[x][y] = new CellData();
            }
        }

        this.previewGroupDatas = [];
    }

    public at(x: number, y: number): CellData {
        return this.cells[x][y];
    }

    public inRange(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    public swap(fromX: number, fromY: number, toX: number, toY: number): void {
        let from: CellData = this.cells[fromX][fromY];
        assert(from != null);

        let to: CellData = this.cells[toX][toY];
        assert(to != null);

        this.cells[fromX][fromY] = to;
        this.cells[toX][toY] = from;
    }

    public get currentPreviewGroupData(): PreviewGroupData {
        return this.previewGroupDatas[this.previewGroupDatas.length - 1];
    }
}