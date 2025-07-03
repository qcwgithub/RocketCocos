import { _decorator, Component, Label, Node } from 'cc';
import { sc } from './sc';
import { LevelConfig } from './LevelConfig';
import { GameData } from './GameData';
import { Panel } from './Panel';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends Panel {
    @property({ type: Label })
    levelLabel: Label;

    public override show(): void {
        super.show();

        this.refreshLevel();
    }

    public override hide(): void {
        super.hide();
    }

    refreshLevel(): void {
        let level: number = sc.profile.level;
        this.levelLabel.string = "LEVEL " + level;
    }

    public onClickStart() {
        let level: number = sc.profile.level;

        var gameData = new GameData();
        gameData.init(level);

        sc.game.startGame(gameData);
        sc.panelManager.gamePanel.startGame();

        this.hide();
    }
}
