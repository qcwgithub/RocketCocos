import { _decorator, Component,  Node, resources, Sprite, SpriteFrame } from 'cc';
import { MyGame } from './Game';
const { ccclass, property } = _decorator;

@ccclass('Rocket')
export class Rocket extends Component {
    @property({ type: Sprite })
    public sprite: Sprite;
    game: MyGame;
    y: number;
    public Init(game: MyGame, y: number): void {
        this.game = game;
        this.y = y;
    }

    Refresh(): void {
        resources.load("Sprites/Rocket/rocket0" + this.game.gameData.rocketDatas[this.y].level, SpriteFrame, (err, spriteFrame) => {
            this.sprite.spriteFrame = spriteFrame;
        });
    }
}


