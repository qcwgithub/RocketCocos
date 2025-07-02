import { _decorator, Component, Label, Node } from 'cc';
import { sc } from './sc';
import { LevelConfig } from './LevelConfig';
import { GameData } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends Component {
    @property({ type: Label })
    levelLabel: Label;

    public show(): void {
        let level: number = sc.profile.level;
        // let levelConfig: LevelConfig = sc.configManager.getLevelConfig(level);
        this.levelLabel.string = "LEVEL " + level;
    }

    public onClickStart() {
        let level: number = sc.profile.level;
        
        var gameData = new GameData();
        gameData.init(level);

        sc.game.startGame(gameData);

        sc.gamePanel.show(gameData);

        this.node.active = false;
    }
}
