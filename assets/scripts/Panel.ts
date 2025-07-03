import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Panel')
export class Panel extends Component {
    public show():void {
        this.node.active = true;
    }

    public hide():void {
        this.node.active = false;
    }
}


