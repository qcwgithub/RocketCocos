import { _decorator, Component, Label, Node } from 'cc';
import { Panel } from './Panel';
import { sc } from '../sc';
const { ccclass, property } = _decorator;

@ccclass('FailPanel')
export class FailPanel extends Panel {
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

    public onClickStart(): void {
        this.hide();

        sc.panelManager.gamePanel.startGame();
    }

    public onClickWatchAd(): void {
        this.hide();
        sc.panelManager.gamePanel.extendTime();
    }
}