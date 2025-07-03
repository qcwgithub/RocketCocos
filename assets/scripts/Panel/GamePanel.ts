import { _decorator, Component, Label, Node } from 'cc';
import { MyGame } from '../MyGame';
import { sc } from '../sc';
const { ccclass, property } = _decorator;

@ccclass('GamePanel')
export class GamePanel extends Component {
    @property({ type: Label })
    rocketCountLabel: Label;

    public startGame(): void {
        this.refreshRocketCount();
        sc.game.eventTarget.on(MyGame.Events.collectRockets, this.onCollectRockets, this);
    }

    onCollectRockets(): void {
        this.refreshRocketCount();

        if (sc.game.gameData.collectedRockets >= sc.game.gameData.levelConfig.rocket) {
            if (sc.profile.level < sc.configManager.maxLevel) {
                sc.profile.level++;
            }

           sc.panelManager.successPanel.show(); 
        }
    }

    refreshRocketCount(): void {

        this.rocketCountLabel.string = "collected " + sc.game.gameData.collectedRockets + "/" + sc.game.gameData.levelConfig.rocket;
    }
}


