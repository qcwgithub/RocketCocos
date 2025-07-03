import { _decorator, Component, Node } from 'cc';
import { Panel } from './Panel';
const { ccclass, property } = _decorator;

@ccclass('SuccessPanel')
export class SuccessPanel extends Panel {
    public override show(): void {
        super.show();
    }
    public override hide(): void {
        super.hide();
    }
    public onClickStart() {
        this.node.active = false;
    }
}


