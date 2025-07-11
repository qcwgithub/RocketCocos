import { _decorator, Component, Label, Node } from 'cc';
import { Panel } from './Panel';
import { sc } from '../sc';
import { GameData } from '../GameData';
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

    public refreshLevel(): void {
        this.levelLabel.string = `第 ${sc.profile.level} 关`;
    }

    // start(): void {
    //     sc.panelManager.gamePanel.startGame();
    // }

    public onClickStart() {
        this.hide();

        sc.panelManager.gamePanel.startGame();
    }

    public onClickSettingsButton(): void {
        sc.panelManager.settingsPanel.show();
    }
}
