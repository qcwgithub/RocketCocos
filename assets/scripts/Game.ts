import { _decorator, assert, Component, Node, Vec2 } from 'cc';
import { GameData } from './GameData';
import { Rocket } from './Rocket';
import { PreviewGroup } from './CellGroup/PreviewGroup';
import { FireGroup } from './CellGroup/FireGroup';
import { MoveGroup } from './CellGroup/MoveGroup';
import { Cell } from './Cell';
import { RotateDir } from './RotateDir';
import { Dir, DirExt } from './Dir';
import { CellData } from './CellData';
import { ShapeExt } from './Shape';
import { Board } from './Board';
const { ccclass, property } = _decorator;

@ccclass('MyGame')
export class MyGame extends Component {
    public gameData: GameData;
    public board: Board;
    public rockets: Rocket[] = [];
    public MyInput myInput = new MyInput();
    public previewGroup: PreviewGroup = new PreviewGroup();
    public fireGroup: FireGroup = new FireGroup();
    public moveGroup: MoveGroup = new MoveGroup();
    public Init(gameData: GameData): void {
        this.gameData = gameData;
        this.board.Init(this);

        this.rockets.length = 0;

        this.myInput.Init(this);
        this.previewGroup.Init(this);
        this.fireGroup.Init(this);
        this.moveGroup.Init(this);
    }

    public get time(): number {
        return Date.now() / 1000;
    }

    update(dt: number): void {
        this.MyUpdate(dt);
    }

    public MyUpdate(dt: number): void {
        this.myInput.MyUpdate(dt);

        for (let i = 0; i < this.board.width; i++) {
            for (let j = 0; j < this.board.height; j++) {
                let cell: Cell = this.board.At(i, j);
                cell.MyUpdate(dt);
            }
        }

        //
        this.HandleDirty();
    }

    dirty: boolean = true;
    public SetDirty(): void {
        this.dirty = true;
    }
    HandleDirty(): void {
        if (!this.dirty) {
            return;
        }
        this.dirty = false;

        this.gameData.RefreshLink();
        this.board.Refresh();

        if (this.fireGroup.firing) {
            return;
        }

        if (this.previewGroup.previewing) {
            this.previewGroup.UpdatePreview(this.gameData.boardData.previewGroupDatas);
        }

        if (this.previewGroup.previewing) {
            return;
        }

        if (this.gameData.boardData.previewGroupDatas.length == 0) {
            return;
        }

        this.previewGroup.Start(this.gameData.boardData.previewGroupDatas[0], this.OnPreviewFinish);
    }

    OnCellRotateFinish(cell: Cell, rotateDir: RotateDir): void {
        this.SetDirty();
        this.HandleDirty();
    }

    public OnClick(x: number, y: number, rotateDir: RotateDir): void {
        console.log(`Click (${x}, ${y})`);

        let cell: Cell = this.board.At(x, y);
        if (!cell.state.AskRotate()) {
            return;
        }

        cell.Rotate(rotateDir, this.OnCellRotateFinish);
        this.SetDirty();
        this.HandleDirty();
    }

    public OnSwipe(prevDir: Dir?, prevPos: Vec2, dir: Dir): void {
        console.log(`OnSwipe ${prevDir} ${prevPos} ${dir}`);

        let dirty: boolean = false;

        // 1

        let cell1: Cell = this.board.At(prevPos.x, prevPos.y);
        let data1: CellData = this.gameData.boardData.At(prevPos.x, prevPos.y);

        const [canLink1, needRotate1, rotateDir1] = prevDir == null
            ? ShapeExt.CanLinkTo(data1.shape, dir)
            : ShapeExt.CanLinkTo2(data1.shape, dir, DirExt.Reverse(prevDir));
        if (canLink1 && needRotate1 && cell1.state.AskRotate()) {
            cell1.Rotate(rotateDir1, this.OnCellRotateFinish);
            dirty = true;
        }

        // 2

        let pos2: Vec2 = prevPos.add(DirExt.ToOffset(dir));
        if (this.board.boardData.InRange(pos2.x, pos2.y)) {
            let cell2: Cell = this.board.At(pos2.x, pos2.y);
            let data2: CellData = this.gameData.boardData.At(pos2.x, pos2.y);

            const [canLinkTo2, needRotate2, rotateDir2] = ShapeExt.CanLinkTo(data2.shape, DirExt.Reverse(dir));
            if (canLinkTo2 && needRotate2 && cell2.state.AskRotate()) {
                cell2.Rotate(rotateDir2, this.OnCellRotateFinish);
                dirty = true;
            }
        }

        if (dirty) {
            this.SetDirty();
            this.HandleDirty();
        }
    }

    OnPreviewFinish(poses: Vec2[]): void {
        assert(!this.fireGroup.firing);
        if (!this.fireGroup.firing) {
            this.fireGroup.Start(poses, this.OnFireFinish);
        }
    }

    OnFireFinish(poses: Vec2[]): void {
        this.moveGroup.Move(poses, this.OnCellMoveFinish);
        this.SetDirty();
        this.HandleDirty();
    }

    OnCellMoveFinish(_cell: Cell): void {
        this.SetDirty();
        this.HandleDirty();
    }
}


