import { _decorator, Component, Label, Node } from 'cc';
import { Panel } from './Panel';
import { sc } from '../sc';
import { GameData } from '../GameData';
const { ccclass, property } = _decorator;

@ccclass('MainPanel')
export class MainPanel extends Panel {
    public override show(): void {
        super.show();
    }

    public override hide(): void {
        super.hide();
    }

    start(): void {
        sc.panelManager.gamePanel.startGame();
    }

    // public onClickStart() {
    //     this.hide();

    //     sc.panelManager.gamePanel.startGame();
    // }

    public onClickSettingsButton(): void {
        sc.panelManager.settingsPanel.show();
    }
}
