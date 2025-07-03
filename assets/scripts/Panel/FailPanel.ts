import { _decorator, Component, Node } from 'cc';
import { Panel } from './Panel';
const { ccclass, property } = _decorator;

@ccclass('FailPanel')
export class FailPanel extends Panel {
    public override show(): void {
        super.show();
    }

    public override hide(): void {
        super.hide();
    }
}


