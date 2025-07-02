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

        this.stateIdle.init(this);
        this.stateRotate.init(this);
        this.statePreview.init(this);
        this.stateFire.init(this);
        this.stateMove.init(this);

        this.state = this.stateIdle;

        this.refresh();
    }

    _name_x: number = -1;
    _name_y: number;
    _name_shape: Shape;
    refreshName(x: number, y: number, shape: Shape): void {
        if (this._name_x != x || this._name_y != y || this._name_shape != shape) {
            this._name_x = x;
            this._name_y = y;
            this._name_shape = shape;
            this.name = `(${x}, ${y}) ${shape}`;
        }
    }

    _sprite_shape: Shape = Shape.Count;
    refreshSprite(shape: Shape): void {
        if (this._sprite_shape != shape) {
            resources.load("sprites/V2/" + Shape[shape], SpriteFrame, (err, spriteFrame) => {
                this.sprite.spriteFrame = spriteFrame;
            });
        }
    }

    _color_inited: boolean = false;
    _color_L: boolean = false;
    _color_R: boolean = false;
    refreshColor(linkedL: boolean, linkedR: boolean): void {
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

    public refresh(): void {
        let cellData: CellData = this.game.gameData.boardData.at(this.x, this.y);

        this.refreshName(this.x, this.y, cellData.shape);

        const [o, o_shape] = this.state.shouldOverrideSpriteShape();
        this.refreshSprite(o ? o_shape : cellData.shape);
        this.refreshColor(cellData.linkedL, cellData.linkedR);
    }

    public myUpdate(dt: number): void {
        this.state.myUpdate(dt);
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

    public rotate(rotateDir: RotateDir, onFinish: (cell: Cell, rotateDir: RotateDir) => void): void {
        this.state = this.stateRotate;
        this.stateRotate.rotate(rotateDir, onFinish);
    }

    public fire(onFinish: (cell: Cell) => void): void {
        this.state = this.stateFire;
        this.stateFire.fire(onFinish);
    }
    public preview(duration: number, initTimer: number, onFinish: (cell: Cell) => void): void {
        this.state = this.statePreview;
        this.statePreview.preview(duration, initTimer, onFinish);
    }

    public move(fromPositionY: number, toPositionY: number, onFinish: (cell: Cell) => void): void {
        this.state = this.stateMove;
        this.stateMove.move(fromPositionY, toPositionY, onFinish);
    }

    public idle(): void {
        this.state = this.stateIdle;
    }
}