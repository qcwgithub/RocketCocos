import { _decorator, assert, Color, Component, Node, resources, Size, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
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
import { sc } from './sc';
import { MySettings } from './MySettings';
import { CellStateType } from './CellState/CellStateType';
import { CellStatePreFire } from './CellState/CellStatePreFire';
const { ccclass, property } = _decorator;

class name_s {
    public x: number;
    public y: number;
    public shape: Shape;

    public cleanup(): void {
        this.x = -1;
        this.y = 0;
        this.shape = Shape.Count;
    }
}

class sprite_s {
    public shape: Shape;

    public cleanup(): void {
        this.shape = Shape.Count;
    }
}

class color_s {
    public inited: boolean;
    public L: boolean;
    public R: boolean;
    public previewing: boolean;
    public firing: boolean;

    public cleanup(): void {
        this.inited = false;
        this.L = false;
        this.R = false;
        this.previewing = false;
        this.firing = false;
    };
}

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
    public statePreFire: CellStatePreFire = new CellStatePreFire();
    public stateFire: CellStateFire = new CellStateFire();
    public stateMove: CellStateMove = new CellStateMove();
    public state: CellState;

    pinging: boolean;
    pingTimer: number;

    public cleanup(): void {
        this.game = null;
        this.x = 0;
        this.y = 0;

        this.stateIdle.cleanup();
        this.stateRotate.cleanup();
        this.statePreview.cleanup();
        this.statePreFire.cleanup();
        this.stateFire.cleanup();
        this.stateMove.cleanup();

        this.state = this.stateIdle;
        this.pinging = false;
        this.pingTimer = 0;

        this._name_s.cleanup();
        this._sprite_s.cleanup();
        this._color_s.cleanup();

        this.node.off(Node.EventType.TOUCH_END, this.onClick, this);
    }

    public init(game: MyGame, x: number, y: number): void {
        this.game = game;
        this.x = x;
        this.y = y;

        // this.node.getComponent(UITransform).contentSize = new Size(MySettings.cellSize, MySettings.cellSize);

        this.stateIdle.init(this);
        this.stateRotate.init(this);
        this.statePreview.init(this);
        this.statePreFire.init(this);
        this.stateFire.init(this);
        this.stateMove.init(this);

        this.state = this.stateIdle;

        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);

        this.refresh();
    }

    onClick(): void {
        this.game.onClick(this.x, this.y, RotateDir.CCW);
    }

    _name_s: name_s = new name_s();
    refreshName(x: number, y: number, shape: Shape): void {
        let s = this._name_s;
        if (s.x != x || s.y != y || s.shape != shape) {
            s.x = x;
            s.y = y;
            s.shape = shape;
            this.name = `(${x}, ${y}) ${shape}`;
        }
    }

    _sprite_s: sprite_s = new sprite_s();
    refreshSprite(shape: Shape): void {
        let s = this._sprite_s;
        if (s.shape != shape) {
            s.shape = shape;
            this.sprite.spriteFrame = sc.myAssets.GetSpriteFrame(Shape[shape]);
        }
    }

    _color_s: color_s = new color_s();
    refreshColor(L: boolean, R: boolean, previewing: boolean, firing: boolean): void {
        let s = this._color_s;
        if (!s.inited || s.L != L || s.R != R || s.previewing != previewing || s.firing != firing) {
            s.inited = true;
            s.L = L;
            s.R = R;
            s.previewing = previewing;
            s.firing = firing;

            if (previewing) {
                return;
            }

            if (firing) {
                return;
            }

            if (L && R) {
                this.sprite.color = MySettings.cellColor.LR;
            }
            else if (L) {
                this.sprite.color = MySettings.cellColor.L;
            }
            else if (R) {
                this.sprite.color = MySettings.cellColor.R;
            }
            else {
                this.sprite.color = MySettings.cellColor.idle;
            }
        }
    }

    public refresh(): void {
        let cellData: CellData = this.game.gameData.boardData.at(this.x, this.y);

        this.refreshName(this.x, this.y, cellData.shape);

        const [o, o_shape] = this.state.shouldOverrideSpriteShape();
        this.refreshSprite(o ? o_shape : cellData.shape);
        this.refreshColor(cellData.linkedL, cellData.linkedR, this.previewing, this.state.type == CellStateType.Fire);
    }

    public ping(): void {
        this.pinging = true;
        this.pingTimer = 0;
    }

    updatePing(dt: number): void {
        if (!this.pinging) {
            return;
        }

        this.pingTimer += dt;

        if (this.pingTimer < MySettings.pingHalfTime) {
            let v3 = sc.pool.getVec3();
            Vec3.lerp(v3, Vec3.ONE, MySettings.pingScale, this.pingTimer / MySettings.pingHalfTime);
            this.node.setScale(v3);
            sc.pool.putVec3(v3);
        }
        else if (this.pingTimer < MySettings.pingHalfTime * 2) {
            let v3 = sc.pool.getVec3();
            Vec3.lerp(v3, MySettings.pingScale, Vec3.ONE, (this.pingTimer - MySettings.pingHalfTime) / MySettings.pingHalfTime);
            this.node.setScale(v3);
            sc.pool.putVec3(v3);
        }
        else {
            this.node.setScale(Vec3.ONE);
            this.pinging = false;
        }
    }

    public myUpdate(dt: number): void {
        this.updatePing(dt);
        this.state.myUpdate(dt);

        this.statePreview.myUpdate(dt);
    }

    assertIsIdle(): void {
        assert(this.state == this.stateIdle, "this.state is not Idle, it is " + CellStateType[this.state.type]);
    }

    public rotate(rotateDir: RotateDir, onFinish: (cell: Cell, rotateDir: RotateDir) => void): void {
        assert(this.state.type == CellStateType.Idle || this.state.type == CellStateType.Rotate,
            "this.state is not Idle nor Rotate, it is " + CellStateType[this.state.type]);

        this.state = this.stateRotate;
        this.stateRotate.rotate(rotateDir, onFinish);
    }

    public canEnterPreFire(): boolean {
        return this.state == this.stateIdle;
    }

    public preFire(): void {
        this.state.willPreFire();
        this.assertIsIdle();

        this.state = this.statePreFire;
        this.statePreFire.preFire();
    }

    public fire(): void {
        assert(this.state == this.statePreFire, "this.state is not PreFire, it is " + CellStateType[this.state.type]);

        this.state = this.stateFire;
        this.stateFire.fire();
    }

    public get previewing(): boolean {
        return this.statePreview.previewing;
    }

    public preview(initTimer: number, onFinish: (cell: Cell) => void): void {
        this.statePreview.preview(initTimer, onFinish);
    }

    public move(fromPositionY: number, toPositionY: number, onFinish: (cell: Cell) => void): void {
        this.state.willMove();

        assert(this.state.type == CellStateType.Idle || this.state.type == CellStateType.Move,
            `this.state is not Idle nor Move, it is ${CellStateType[this.state.type]}, ${this.x} ${this.y}`);

        this.state = this.stateMove;
        this.stateMove.move(fromPositionY, toPositionY, onFinish);
    }

    public idle(): void {
        this.state = this.stateIdle;
    }
}