import { _decorator, Component, Label, Node } from 'cc';
import { GameData } from './GameData';
import { sc } from './sc';
import { MyGame } from './MyGame';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    @property({ type: Label })
    rocketCountLabel: Label;
    public startGame(): void {
        this.rocketCountLabel.string = "collected " + sc.game.gameData.collectedRockets;
        sc.game.eventTarget.on(MyGame.Events.collectRockets, this.onCollectRockets, this);
    }

    onCollectRockets(): void {
        this.rocketCountLabel.string = "collected " + sc.game.gameData.collectedRockets;
    }
}


