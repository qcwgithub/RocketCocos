import { _decorator, Component, Node, SpriteFrame } from 'cc';
import { Shape } from './Shape';
const { ccclass, property } = _decorator;

@ccclass('MyAssets')
export class MyAssets extends Component {
    @property({ type: SpriteFrame })
    L: SpriteFrame;
    @property({ type: SpriteFrame })
    R: SpriteFrame;
    @property({ type: SpriteFrame })
    T: SpriteFrame;
    @property({ type: SpriteFrame })
    B: SpriteFrame;
    @property({ type: SpriteFrame })
    LR: SpriteFrame;
    @property({ type: SpriteFrame })
    LT: SpriteFrame;
    @property({ type: SpriteFrame })
    LB: SpriteFrame;
    @property({ type: SpriteFrame })
    RT: SpriteFrame;
    @property({ type: SpriteFrame })
    RB: SpriteFrame;
    @property({ type: SpriteFrame })
    TB: SpriteFrame;
    @property({ type: SpriteFrame })
    LRT: SpriteFrame;
    @property({ type: SpriteFrame })
    LRB: SpriteFrame;
    @property({ type: SpriteFrame })
    LTB: SpriteFrame;
    @property({ type: SpriteFrame })
    RTB: SpriteFrame;
    @property({ type: SpriteFrame })
    LRTB: SpriteFrame;

    @property({ type: SpriteFrame })
    rocket: SpriteFrame;

    spriteFrameMap: Map<string, SpriteFrame> = null;
    public GetSpriteFrame(name: string): SpriteFrame {
        if (this.spriteFrameMap == null) {
            this.spriteFrameMap = new Map<string, SpriteFrame>();
            this.spriteFrameMap[Shape[Shape.L]] = this.L;
            this.spriteFrameMap[Shape[Shape.R]] = this.R;
            this.spriteFrameMap[Shape[Shape.T]] = this.T;
            this.spriteFrameMap[Shape[Shape.B]] = this.B;
            this.spriteFrameMap[Shape[Shape.LR]] = this.LR;
            this.spriteFrameMap[Shape[Shape.LT]] = this.LT;
            this.spriteFrameMap[Shape[Shape.LB]] = this.LB;
            this.spriteFrameMap[Shape[Shape.RT]] = this.RT;
            this.spriteFrameMap[Shape[Shape.RB]] = this.RB;
            this.spriteFrameMap[Shape[Shape.TB]] = this.TB;
            this.spriteFrameMap[Shape[Shape.LRT]] = this.LRT;
            this.spriteFrameMap[Shape[Shape.LRB]] = this.LRB;
            this.spriteFrameMap[Shape[Shape.LTB]] = this.LTB;
            this.spriteFrameMap[Shape[Shape.RTB]] = this.RTB;
            this.spriteFrameMap[Shape[Shape.LRTB]] = this.LRTB;

            this.spriteFrameMap["rocket"] = this.rocket;
        }

        return this.spriteFrameMap[name];
    }
}