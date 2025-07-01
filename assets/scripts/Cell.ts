import { _decorator, Color, Component, Node, resources, Sprite, SpriteFrame } from 'cc';
import { Shape } from './Shape';
import { CellData } from './CellData';
import { RotateDir } from './RotateDir';
import { MyGame } from './MyGame';
import { CellStateMove } from './CellState/CellStateMove';
import { CellStateFire } from './CellState/CellStateFire';
import { CellStatePreview } from './CellState/CellStatePreview';
import { CellStateIdle } from './CellState/CellStateIdle';
import { CellStateRotate } from './CellState/CellStateRotate';
import { CellState } from './CellState/CellState';
const { ccclass, property } = _decorator;

@ccclass('Cell')
export class Cell extends Component {
    @property({ type: Sprite })
    public sprite: Sprite;
    public game: MyGame;
    public x: number;
    public y: number;
    public stateIdle: CellStateIdle = new CellStateIdle();
    public stateRotate: CellStateRotate = new CellStateRotate();
    public statePreview: CellStatePreview = new CellStatePreview();
    public stateFire: CellStateFire = new CellStateFire();
    public stateMove: CellStateMove = new CellStateMove();
    public state: CellState;
    public Init(game: MyGame, x: number, y: number): void {
        this.game = game;
        this.x = x;
        this.y = y;

        this.stateIdle.Init(this);
        this.stateRotate.Init(this);
        this.statePreview.Init(this);
        this.stateFire.Init(this);
        this.stateMove.Init(this);

        this.state = this.stateIdle;

        this.Refresh();
    }

    _name_x: number = -1;
    _name_y: number;
    _name_shape: Shape;
    RefreshName(x: number, y: number, shape: Shape): void {
        if (this._name_x != x || this._name_y != y || this._name_shape != shape) {
            this._name_x = x;
            this._name_y = y;
            this._name_shape = shape;
            this.name = `(${x}, ${y}) ${shape}`;
        }
    }

    _sprite_shape: Shape = Shape.Count;
    RefreshSprite(shape: Shape): void {
        if (this._sprite_shape != shape) {
            resources.load("Sprites/V2/" + shape, SpriteFrame, (err, spriteFrame) => {
                this.sprite.spriteFrame = spriteFrame;
            });
        }
    }

    _color_inited: boolean = false;
    _color_L: boolean = false;
    _color_R: boolean = false;
    RefreshColor(linkedL: boolean, linkedR: boolean): void {
        if (!this._color_inited || this._color_L != linkedL || this._color_R != linkedR) {
            this._color_inited = true;
            this._color_L = linkedL;
            this._color_R = linkedR;

            if (linkedL && linkedR) {
                this.sprite.color = Color.GREEN;
            }
            else if (linkedL) {
                this.sprite.color = Color.YELLOW;
            }
            else if (linkedR) {
                this.sprite.color = Color.RED;
            }
            else {
                this.sprite.color = Color.WHITE;
            }
        }
    }

    public Refresh(): void {
        let cellData: CellData = this.game.gameData.boardData.At(this.x, this.y);

        this.RefreshName(this.x, this.y, cellData.shape);

        const [o, o_shape] = this.state.OverrideSpriteShape();
        this.RefreshSprite(o ? o_shape : cellData.shape);
        this.RefreshColor(cellData.linkedL, cellData.linkedR);
    }

    public MyUpdate(dt: number): void {
        this.state.MyUpdate(dt);
    }
    public get rotating(): boolean {
        return this.state == this.stateRotate && this.stateRotate.rotating;
    }

    public get firing(): boolean {
        return this.state == this.stateFire && this.stateFire.firing;
    }
    public get previewing(): boolean {
        return this.state == this.statePreview && this.statePreview.previewing;
    }

    public Rotate(rotateDir: RotateDir, onFinish: (cell: Cell, rotateDir: RotateDir) => void): void {
        this.state = this.stateRotate;
        this.stateRotate.Rotate(rotateDir, onFinish);
    }

    public Fire(onFinish: (cell: Cell) => void): void {
        this.state = this.stateFire;
        this.stateFire.Fire(onFinish);
    }
    public Preview(duration: number, initTimer: number, onFinish: (cell: Cell) => void): void {
        this.state = this.statePreview;
        this.statePreview.Preview(duration, initTimer, onFinish);
    }

    public Move(fromPositionY: number, toPositionY: number, onFinish: (cell: Cell) => void): void {
        this.state = this.stateMove;
        this.stateMove.Move(fromPositionY, toPositionY, onFinish);
    }

    public Idle(): void {
        this.state = this.stateIdle;
    }
}