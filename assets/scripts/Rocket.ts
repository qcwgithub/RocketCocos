import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Vec3 } from 'cc';
import { MyGame } from './MyGame';
import { sc } from './sc';
import { MySettings } from './MySettings';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Component {
    @property({ type: Sprite })
    public sprite: Sprite;
    game: MyGame;
    posY: number;
    initPosition: Vec3 = new Vec3(0, 0, 0);
    flying: boolean;
    flyTime: number;
    public init(game: MyGame, y: number): void {
        this.game = game;
        this.posY = y;

        this.initPosition.x = game.board.getPositionX(game.gameData.boardData.width - 1) + MySettings.cellSize * 0.5;
        this.initPosition.y = game.board.getPositionY(y);
        this.initPosition.z = 0;
        this.node.setPosition(this.initPosition);

        this.node.active = true;
        this.flying = false;
        this.flyTime = 0;
    }

    refresh(): void {
        this.sprite.spriteFrame = sc.myAssets.rocket;
    }

    public myUpdate(dt: number): void {
        if (this.flying) {
            let x = this.node.x;
            let y = this.node.y;

            x += MySettings.flySpeed.x * dt;
            y += MySettings.flySpeed.y * dt;

            let v3 = sc.pool.getVec3();
            v3.x = x;
            v3.y = y;
            v3.z = this.initPosition.z;
            this.node.setPosition(v3);
            sc.pool.putVec3(v3);

            this.flyTime += dt;
            if (this.flyTime >= MySettings.flyTime) {
                this.node.setPosition(this.initPosition);
                this.flying = false;
            }
        }
    }

    public fly(): void {
        if (this.flying) {
            this.node.setPosition(this.initPosition);
        }

        sc.audioManager.playRocketLaunch();

        this.flying = true;
        this.flyTime = 0;
    }
}


