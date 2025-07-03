import { _decorator, Component, Label, Node } from 'cc';
import { MyGame } from '../MyGame';
import { sc } from '../sc';
import { GameData } from '../GameData';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    @property({ type: MyGame })
    public game: MyGame;

    @property({ type: Label })
    rocketCountLabel: Label;

    public startGame(): void {
        this.cleanup();

        let level: number = sc.profile.level;

        var gameData = new GameData();
        gameData.init(level);

        this.game.startGame(gameData);

        this.refreshRocketCount();

        this.game.eventTarget.on(MyGame.Events.collectRockets, this.onCollectRockets, this);

        this.node.active = true;
    }

    public cleanup(): void {
        this.node.active = false;

        this.game.eventTarget.off(MyGame.Events.collectRockets, this.onCollectRockets, this);
        this.game.cleanup();
    }

    onCollectRockets(): void {
        this.refreshRocketCount();

        let gameData: GameData = this.game.gameData;

        if (gameData.collectedRockets >= gameData.levelConfig.rocket) {
            if (sc.profile.level < sc.configManager.maxLevel) {
                sc.profile.level++;
            }

            sc.panelManager.successPanel.show();
        }
    }

    refreshRocketCount(): void {
        let gameData: GameData = this.game.gameData;

        this.rocketCountLabel.string = "collected " + gameData.collectedRockets + "/" + gameData.levelConfig.rocket;
    }
}


