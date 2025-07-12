import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Guide')
export class Guide extends Component {
    onLoad(): void {
        this.init();
    }

    inited = false;
    init(): void {
        if (this.inited) {
            return;
        }
        this.inited = true;

        for (const child of this.node.children) {
            if (child.name.startsWith("level")) {
                child.active = false;
            }
        }

        this.node.active = false;
    }

    showLevel: number = -1;
    public show(level: number, onClickHandler: () => void): boolean {
        this.init();

        let child: Node = this.node.getChildByName("level" + level);
        if (child == null) {
            return false;
        }

        this.showLevel = level;
        this.onClickHandler = onClickHandler;
        child.active = true;
        this.node.active = true;

        return true;
    }

    public hide(): void {
        let child: Node = this.node.getChildByName("level" + this.showLevel);
        child.active = false;
        this.node.active = false;
    }

    onClickHandler: () => void;
    public onClick(): void {
        this.onClickHandler();
    }
}