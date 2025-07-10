import { _decorator, Component, Node, Toggle } from 'cc';
import { Panel } from './Panel';
import { sc } from '../sc';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanel')
export class SettingsPanel extends Panel {
    @property({ type: Toggle })
    toggleBgm: Toggle;

    @property({ type: Toggle })
    toggleSound: Toggle;

    @property({ type: Toggle })
    toggleVibrate: Toggle;

    public override show(): void {
        super.show();

        this.toggleBgm.isChecked = sc.profile.bgm;
        this.toggleSound.isChecked = sc.profile.sound;
        this.toggleVibrate.isChecked = sc.profile.vibrate;
    }

    public onClickToggle(toggle: Toggle, custom: string): void {
        if (toggle == this.toggleBgm) {
            sc.profile.bgm = toggle.isChecked;
        }
        else if (toggle == this.toggleSound) {
            sc.profile.sound = toggle.isChecked;
        }
        else if (toggle == this.toggleVibrate) {
            sc.profile.vibrate = toggle.isChecked;
        }
    }

    public onClickResetProgress(): void {
        sc.profile.level = 1;
        sc.panelManager.gamePanel.startGame();
    }
}


