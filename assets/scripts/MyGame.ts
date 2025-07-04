import { _decorator, assert, Component, EventTarget, Vec2, Node, instantiate, Vec3 } from 'cc';
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
import { MyInput } from './MyInput';
import { sc } from './sc';
import { MySettings } from './MySettings';
const { ccclass, property } = _decorator;

@ccclass('MyGame')
export class MyGame extends Component {
    @property({ type: Board })
    board: Board;

    @property({ type: Node })
    matchTemplate: Node;

    @property({ type: Node })
    rocketTemplate: Node;

    @property({ type: Node })
    fireTracerTemplate: Node;

    public gameData: GameData;
    rockets: Rocket[] = [];

    public static Events = {
        collectRockets: "collectRockets"
    };
    public eventTarget: EventTarget = new EventTarget();
    public myInput: MyInput = new MyInput();
    public previewGroup: PreviewGroup = new PreviewGroup();
    public fireGroup: FireGroup = new FireGroup();
    public moveGroup: MoveGroup = new MoveGroup();

    onCellRotateFinish_bind: (cell: Cell, rotateDir: RotateDir) => void;
    onPreviewFinish_bind: (poses: number[]) => void;
    onFireFinish_bind: (poses: number[]) => void;
    onCellMoveFinish_bind: (cell: Cell) => void;

    public cleanup(): void {
        this.board.cleanup();
        this.gameData = null;

        this.clearupMatches();
        this.cleanupRockets();

        this.fireGroup.cleanup();
        this.previewGroup.cleanup();
        this.moveGroup.cleanup();

        this.onCellRotateFinish_bind = null;
        this.onPreviewFinish_bind = null;
        this.onFireFinish_bind = null;
        this.onCellMoveFinish_bind = null;
    }

    public startGame(gameData: GameData): void {
        this.gameData = gameData;
        this.board.startGame(this);

        this.initMatches();
        this.initRockets();

        this.myInput.init(this);
        this.previewGroup.startGame(this);
        this.fireGroup.startGame(this);
        this.moveGroup.startGame(this);

        this.onCellRotateFinish_bind = this.onCellRotateFinish.bind(this);
        this.onPreviewFinish_bind = this.onPreviewFinish.bind(this);
        this.onFireFinish_bind = this.onFireFinish.bind(this);
        this.onCellMoveFinish_bind = this.onCellMoveFinish.bind(this);
    }

    clearupMatches(): void {
        sc.hideChildren(this.matchTemplate);
    }

    initMatchNode(index: number, child: Node): void {
        let x: number = this.board.getPositionX(0) - MySettings.cellSize * 0.5;
        let y: number = this.board.getPositionY(index);

        sc.tempVec3.x = x;
        sc.tempVec3.y = y;
        sc.tempVec3.z = 0;
        child.setPosition(sc.tempVec3);
    }

    initMatches(): void {
        let L: number = this.gameData.boardData.height;
        sc.instantiateChildren(this.matchTemplate, L, this.initMatchNode.bind(this));
    }

    cleanupRockets(): void {
        sc.hideChildren(this.rocketTemplate);
        this.rockets.length = 0;
    }

    initRocketNode(index: number, child: Node): void {
        let rocket: Rocket = child.getComponent(Rocket);
        rocket.init(this, index);
        this.rockets[index] = rocket;
    }

    initRockets(): void {
        let L: number = this.gameData.boardData.height;
        this.rockets.length = L;

        sc.instantiateChildren(this.rocketTemplate, L, this.initRocketNode.bind(this));
    }

    public myUpdate(dt: number): void {
        if (this.gameData == null) {
            return;
        }

        this.myInput.myUpdate(dt);

        this.fireGroup.myUpdate(dt);

        for (const rocket of this.rockets) {
            rocket.myUpdate(dt);
        }

        for (let i = 0; i < this.board.width; i++) {
            for (let j = 0; j < this.board.height; j++) {
                let cell: Cell = this.board.at(i, j);
                cell.myUpdate(dt);
            }
        }

        //
        this.handleDirty();
    }

    dirty: boolean = true;
    public setDirty(): void {
        this.dirty = true;
    }
    handleDirty(): void {
        if (!this.dirty) {
            return;
        }
        this.dirty = false;

        this.gameData.refreshLink();
        this.board.refresh();

        if (this.fireGroup.firing) {
            return;
        }

        if (this.previewGroup.previewing) {
            this.previewGroup.updatePreview(this.gameData.boardData.previewGroupDatas);
        }

        if (this.previewGroup.previewing) {
            return;
        }

        if (this.gameData.boardData.previewGroupDatas.length == 0) {
            return;
        }

        this.previewGroup.start(this.gameData.boardData.previewGroupDatas[0], this.onPreviewFinish_bind);
    }

    onCellRotateFinish(cell: Cell, rotateDir: RotateDir): void {
        this.setDirty();
        this.handleDirty();
    }

    public onClick(x: number, y: number, rotateDir: RotateDir): void {
        console.log(`Click (${x}, ${y})`);

        let cell: Cell = this.board.at(x, y);
        if (!cell.state.askRotate()) {
            return;
        }

        cell.rotate(rotateDir, this.onCellRotateFinish.bind(this));
        this.setDirty();
        this.handleDirty();
    }

    public onSwipe(hasPrevDir: boolean, prevDir: Dir, prevPos: Vec2, dir: Dir): void {
        console.log(`OnSwipe ${prevDir} ${prevPos} ${dir}`);

        let dirty: boolean = false;

        // 1

        let cell1: Cell = this.board.at(prevPos.x, prevPos.y);
        let data1: CellData = this.gameData.boardData.at(prevPos.x, prevPos.y);

        const [canLink1, needRotate1, rotateDir1] = hasPrevDir
            ? ShapeExt.canLinkTo2(data1.shape, dir, DirExt.reverse(prevDir))
            : ShapeExt.canLinkTo(data1.shape, dir);

        if (canLink1 && needRotate1 && cell1.state.askRotate()) {
            cell1.rotate(rotateDir1, this.onCellRotateFinish.bind(this));
            dirty = true;
        }

        // 2

        let x2 = prevPos.x + DirExt.toOffsetX(dir);
        let y2 = prevPos.y + DirExt.toOffsetY(dir);
        if (this.board.boardData.inRange(x2, y2)) {
            let cell2: Cell = this.board.at(x2, y2);
            let data2: CellData = this.gameData.boardData.at(x2, y2);

            const [canLinkTo2, needRotate2, rotateDir2] = ShapeExt.canLinkTo(data2.shape, DirExt.reverse(dir));

            if (canLinkTo2 && needRotate2 && cell2.state.askRotate()) {
                cell2.rotate(rotateDir2, this.onCellRotateFinish_bind);
                dirty = true;
            }
        }

        if (dirty) {
            this.setDirty();
            this.handleDirty();
        }
    }

    onPreviewFinish(poses: number[]): void {
        assert(!this.fireGroup.firing);
        if (!this.fireGroup.firing) {
            this.fireGroup.start(poses, this.onFireFinish_bind);
        }
    }

    onFireFinish(poses: number[]): void {
        let pre: number = this.gameData.collectedRockets;
        for (const pos of poses) {
            const [x, y] = sc.decodePos(pos);
            if (x == this.gameData.boardData.width - 1 &&
                ShapeExt.getSettings(this.gameData.boardData.at(x, y).shape).linkedDirs.indexOf(Dir.R) >= 0) {
                this.gameData.collectedRockets++;

                this.rockets[y].fly();
            }
        }
        if (this.gameData.collectedRockets > pre) {
            this.eventTarget.emit(MyGame.Events.collectRockets);
        }

        this.moveGroup.move(poses, this.onCellMoveFinish_bind);
        this.setDirty();
        this.handleDirty();
    }

    onCellMoveFinish(_cell: Cell): void {
        this.setDirty();
        this.handleDirty();
    }
}
